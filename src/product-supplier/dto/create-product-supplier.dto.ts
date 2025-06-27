import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@commons/decorators/trim.decorator';

export class CreateProductSupplierDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  supplierProductCode: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  costPrice: number;

  @ApiProperty()
  @IsOptional()
  isPrimarySupplier: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  product: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  supplier: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  createdBy: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  updatedBy: number;

  @ApiProperty()
  @IsNumber()
  deletedBy: number | null;
}
