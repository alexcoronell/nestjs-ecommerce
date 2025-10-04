import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
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

  @IsPhoneNumber()
  @ApiProperty()
  readonly phoneNumber: string;

  @IsEnum(UserRoleEnum, {
    message: `Role must be a valid enum value: ${Object.values(UserRoleEnum).join(', ')}`,
  })
  @IsOptional()
  @ApiProperty()
  readonly role: UserRoleEnum;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly createdBy: number | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly updatedBy: number | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly deletedBy: number | null;
}
