import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePurchaseDto {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: Date, description: 'Purchase date' })
  readonly purchaseDate: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'Total amount of the purchase' })
  readonly totalAmount: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'ID of the user who created the purchase',
  })
  readonly createdBy: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'ID of the user who updated the purchase',
  })
  readonly updatedBy: number;

  @IsNumber()
  @Min(1)
  @ApiProperty({
    type: Number,
    description: 'ID of the supplier associated with the purchase',
  })
  readonly supplier: number;
}
