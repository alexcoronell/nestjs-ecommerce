import { plainToInstance } from 'class-transformer';
import { Trim } from './trim.decorator';

class TestDto {
  @Trim()
  name: string;
}

describe('Trim Decorator', () => {
  it('should trim whitespace from string', () => {
    const dto = plainToInstance(TestDto, { name: '  hello  ' });
    expect(dto.name).toBe('hello');
  });

  it('should not modify non-string values', () => {
    const dto = plainToInstance(TestDto, { name: 123 });
    expect(dto.name).toBe(123);
  });

  it('should handle undefined values', () => {
    const dto = plainToInstance(TestDto, {});
    expect(dto.name).toBeUndefined();
  });
});
