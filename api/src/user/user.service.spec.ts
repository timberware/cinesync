import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let fakePrismaService: Partial<PrismaService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: fakePrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
