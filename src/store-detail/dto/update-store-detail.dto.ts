import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStoreDetailDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  address: string | null;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  phone: string | null;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  legal_information: string | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly createdBy: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly updatedBy: number;
}
