import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreatePersonDto } from '@commons/dtos/CreatePerson.dto';

export class CreateCustomerDto extends CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly neighborhood: string;
}
