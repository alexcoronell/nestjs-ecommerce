import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import config from '@config/index';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    jwtSecret: 'test-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return payload on validate', () => {
    const payload = { user: 1, isAdmin: true, isCustomer: false };
    expect(strategy.validate(payload)).toEqual(payload);
  });
});
