/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/* Services */
import { AuthService } from './auth.service';
import { UserService } from '@user/user.service';

import config from '@config/index';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
            verify: jest.fn().mockReturnValue({ userId: 1 }),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue({
              data: {
                id: 1,
                email: 'test@test.com',
                password: 'hashedPassword',
              },
            }),
          },
        },
        {
          provide: config.KEY,
          useValue: {
            jwtSecret: 'testSecret',
          } as ConfigType<typeof config>,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });
});
