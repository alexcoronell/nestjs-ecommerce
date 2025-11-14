/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/* Services */
import { AuthService } from './auth.service';
import { UserService } from '@user/user.service';

/* Config */
import config from '@config/index';

/* Enums */
import { UserRoleEnum } from '@commons/enums/user-role.enum';

/* Fakers */
import { generateUser } from '@faker/user.faker';
import { PayloadToken } from './interfaces/token.interface';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  describe('AuthService', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: JwtService,
            useValue: {
              sign: jest.fn().mockReturnValue('mockedJwtToken'),
              signAsync: jest.fn().mockResolvedValue('mockedRefreshToken'),
              verify: jest.fn().mockReturnValue({ userId: 1 }),
              decode: jest.fn().mockReturnValue({ user: 1 }),
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
              findAndValidateEmail: jest.fn().mockResolvedValue({
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
              apikey: undefined,
              jwtSecret: 'testSecret',
              jwtExpirationTime: undefined,
              jwtRefreshTokenSecret: 'testRefreshSecret',
              jwtRefreshTokenExpirationTime: '604800',
            } as unknown as ConfigType<typeof config>,
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

    describe('validateUser', () => {
      it('should return user data if credentials are valid', async () => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        const result = await service.validateUser('test@test.com', 'password');
        expect(result).toEqual({ id: 1, email: 'test@test.com' });
      });

      it('should return null if credentials are invalid', async () => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
        const result = await service.validateUser(
          'test@test.com',
          'wrongPassword',
        );
        expect(result).toBeFalsy();
      });
    });

    describe('generateJWT', () => {
      it('should generate access and refresh tokens', async () => {
        const user = generateUser();
        const result = await service.generateJWT(user);
        expect(result).toEqual({
          access_token: 'mockedJwtToken',
          refresh_token: 'mockedRefreshToken',
        });
      });
    });

    describe('refreshToken', () => {
      it('should generate a new access token', async () => {
        const dto = { refresh: 'mockedRefreshToken' };
        const result = await service.refreshToken(dto);
        expect(result).toEqual({
          access_token: 'mockedRefreshToken',
        });
      });
    });

    describe('generateRefreshToken', () => {
      it('should throw an error if refresh token secret is not defined', async () => {
        service.jwtRefreshTokenSecret = null;
        const payload: PayloadToken = { user: 1, role: UserRoleEnum.ADMIN };
        await expect(service['generateRefreshToken'](payload)).rejects.toThrow(
          'JWT refresh token secret is not defined',
        );
      });

      it('should generate a refresh token', async () => {
        const payload: PayloadToken = { user: 1, role: UserRoleEnum.ADMIN };
        const result = await service['generateRefreshToken'](payload);
        expect(result).toBe('mockedRefreshToken');
      });
    });
  });
});
