import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  shippingStatus: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  user: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  paymentMethod: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  shippingCompany: number;
}
