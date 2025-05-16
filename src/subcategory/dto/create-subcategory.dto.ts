import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@commons/decorators/trim.decorator';

export class CreateSubcategoryDto {
  @Trim()
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
