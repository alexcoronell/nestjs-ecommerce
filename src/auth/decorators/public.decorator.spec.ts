import { SetMetadata } from '@nestjs/common';
import { Public, IS_PUBLIC_KEY } from './public.decorator';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('Public Decorator', () => {
  it('should call SetMetadata with correct key and value', () => {
    (SetMetadata as jest.Mock).mockClear();
    Public();
    expect(SetMetadata).toHaveBeenCalledWith(IS_PUBLIC_KEY, true);
  });

  it('should return the result of SetMetadata', () => {
    const mockReturn = jest.fn();
    (SetMetadata as jest.Mock).mockReturnValue(mockReturn);
    const result = Public();
    expect(result).toBe(mockReturn);
  });
});
