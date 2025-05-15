import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

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
