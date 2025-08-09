import { IsString, IsNotEmpty, IsPhoneNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly lastname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;

  @IsPhoneNumber()
  @ApiProperty()
  readonly phoneNumber: string;
}
