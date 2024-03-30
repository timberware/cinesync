import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDao } from './dao/auth.dao';

@Injectable()
export class AuthService {
  private SALT_ROUNDS: number;
  constructor(
    private dao: AuthDao,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.SALT_ROUNDS = parseInt(
      this.configService.get<string>('SALT_ROUNDS') || '10',
    );
  }

  hash(pwd: string) {
    return bcrypt.hash(pwd, this.SALT_ROUNDS);
  }

  compare(pwd: string, hash: string) {
    return bcrypt.compare(pwd, hash);
  }

  async signup(createUser: CreateUserDto) {
    const { username, email, password } = createUser;

    const hashedPassword = await this.hash(password);

    const user = await this.dao.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  }

  getUser(email: string) {
    return this.dao.getUser(email);
  }

  deleteUser(userId: string) {
    return this.dao.deleteUser(userId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.dao.getUser(email);

    if (!user)
      throw new UnauthorizedException('Email or Password are incorrect');

    const passwordsMatch = await this.compare(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Email or Password are incorrect');
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        ...(this.configService.get<string>('NODE_ENV') === 'production'
          ? {
              expiresIn: '7d',
            }
          : null),
      }),
    };
  }
}
