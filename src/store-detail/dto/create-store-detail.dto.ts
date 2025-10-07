import { IsString, IsOptional, IsPhoneNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDetailDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly country: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly state: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly city: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly neighborhood: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly address: string | null;

  @IsPhoneNumber()
  @IsOptional()
  @ApiProperty()
  readonly phone: string | null;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  readonly email: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly legalInformation: string | null;
}
