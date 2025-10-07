import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDetailDto {
  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  subtotal: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  purchase: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  product: number;
}
