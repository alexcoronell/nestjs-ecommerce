import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@commons/decorators/trim.decorator';

export class CreateProductDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @Trim()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @ApiProperty()
  readonly price: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  @ApiProperty()
  readonly stock: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  category: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  subcategory: number;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  brand: number;
}
