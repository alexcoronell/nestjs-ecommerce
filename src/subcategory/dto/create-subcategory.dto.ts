import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@commons/decorators/trim.decorator';

export class CreateSubcategoryDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @Trim()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly slug: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty()
  category: number;
}
