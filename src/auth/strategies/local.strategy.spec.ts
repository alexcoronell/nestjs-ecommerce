import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '@auth/auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user if validation succeeds', async () => {
    const user = { id: 1, username: 'test' };
    mockAuthService.validateUser.mockResolvedValue(user);

    await expect(strategy.validate('test', 'pass')).resolves.toEqual(user);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith('test', 'pass');
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    mockAuthService.validateUser.mockResolvedValue(null);

    await expect(strategy.validate('test', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockAuthService.validateUser).toHaveBeenCalledWith('test', 'wrong');
  });
});
