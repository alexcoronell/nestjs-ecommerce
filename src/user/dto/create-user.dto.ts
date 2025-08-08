import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRoleEnum } from '@commons/enums/user-role.enum';

export class CreateUserDto {
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

  @IsString()
  @ApiProperty()
  readonly address: string;

  @IsString()
  @ApiProperty()
  readonly neighborhood: string;

  @IsPhoneNumber()
  @ApiProperty()
  readonly phoneNumber: string;

  @IsEnum(UserRoleEnum, {
    message: `Role must be a valid enum value: ${Object.values(UserRoleEnum).join(', ')}`,
  })
  @IsNotEmpty()
  readonly role: UserRoleEnum;

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
