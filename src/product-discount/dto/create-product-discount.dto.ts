import { Min, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDiscountDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  product: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  discount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  createdBy: number;
}
