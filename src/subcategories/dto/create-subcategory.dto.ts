import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  category: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly updatedBy: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly deletedBy: number | null;
}
