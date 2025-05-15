import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import config from '@config/index';

describe('JwtRefreshTokenStrategy', () => {
  let strategy: JwtRefreshTokenStrategy;

  const mockConfigService = {
    jwtRefreshTokenSecret: 'test-secret',
    jwtRefreshTokenExpirationTime: '1d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshTokenStrategy,
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtRefreshTokenStrategy>(JwtRefreshTokenStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return payload on validate', () => {
    const payload = { user: 1 };
    expect(strategy.validate(payload)).toEqual(payload);
  });
});
