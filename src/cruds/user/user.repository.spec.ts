import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const dto: RegisterDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: '123456',
    };

    prismaService.user.create = jest.fn().mockResolvedValue({ ...dto, id: 1 });
    const result = await userRepository.createUser(dto);
    expect(result.email).toBe(dto.email);
  });

  it('should find a user by email', async () => {
    prismaService.user.findFirst = jest
      .fn()
      .mockResolvedValue({ id: 1, email: 'test@example.com' });

    const user = await userRepository.findByEmail('test@example.com');
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@example.com');
  });
});
