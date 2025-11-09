import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SaleStatusEnum } from '@commons/enums/sale-status.enum';

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

  @IsEnum(SaleStatusEnum, {
    message: `Sale Status must be a valid enum value: ${Object.values(SaleStatusEnum).join(', ')}`,
  })
  @IsOptional()
  @ApiProperty()
  readonly status?: SaleStatusEnum;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  paymentMethod: number;
}
