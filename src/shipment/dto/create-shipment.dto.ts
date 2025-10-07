import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@commons/decorators/trim.decorator';
import { ShipmentStatusEnum } from '@commons/enums/shipment-status.enum';

export class CreateShipmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Trim()
  readonly trackingNumber: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Trim()
  readonly shipmentDate: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @Trim()
  readonly estimatedDeliveryDate: Date;

  @IsEnum(ShipmentStatusEnum, {
    message: `Status must be a valid enum value: ${Object.values(ShipmentStatusEnum).join(', ')}`,
  })
  @IsNotEmpty()
  readonly status: ShipmentStatusEnum;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  readonly sale: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty()
  readonly shippingCompany: number;
}
