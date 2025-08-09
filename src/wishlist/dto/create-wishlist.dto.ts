import { Min, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  customer: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  product: number;
}
