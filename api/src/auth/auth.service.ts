import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthDao } from './dao/auth.dao';
import { UserDto } from './dto/user.dto';
import { TokenPayload } from './dto/token-payload.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDao: AuthDao,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  hash(pwd: string) {
    return argon2.hash(pwd);
  }

  compare(pwd: string, hash: string) {
    return argon2.verify(hash, pwd);
  }

  async signup(createUser: CreateUserDto) {
    const { username, email, password } = createUser;

    const hashedPassword = await this.hash(password);

    const user = await this.authDao.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  }

  getUser(email: string) {
    return this.authDao.getUser(email);
  }

  getUserById(id: string) {
    return this.authDao.getUserById(id);
  }

  deleteUser(userId: string) {
    return this.authDao.deleteUser(userId);
  }

  async validateUser(email: string, password: string) {
    const user = await this.authDao.getUser(email);

    if (!user) throw new NotFoundException('Email or Password are incorrect');

    const passwordsMatch = await this.compare(password, user.password);

    if (!passwordsMatch) {
      throw new UnauthorizedException('Email or Password are incorrect');
    }

    return user;
  }

  login(user: UserDto, response: Response) {
    const expirationTime = new Date();
    const extraTime =
      this.configService.getOrThrow<string>('JWT_EXPIRATION_MS');

    expirationTime.setMilliseconds(
      expirationTime.getMilliseconds() + parseInt(extraTime, 10),
    );

    const payload: TokenPayload = { userId: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: `${extraTime}ms`,
    });

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires: expirationTime,
    });
  }
}
