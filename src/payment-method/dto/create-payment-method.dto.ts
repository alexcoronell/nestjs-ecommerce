import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;
}
