import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreatePersonDto } from '@commons/dtos/CreatePerson.dto';

import { UserRoleEnum } from '@commons/enums/user-role.enum';

export class CreateUserDto extends CreatePersonDto {
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
