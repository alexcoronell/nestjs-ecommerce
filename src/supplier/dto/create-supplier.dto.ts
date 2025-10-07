import { IsString, IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  contactName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
