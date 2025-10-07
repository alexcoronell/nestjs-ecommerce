import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@commons/decorators/trim.decorator';

export class CreateDiscountDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly code: string;

  @Trim()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @Trim()
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly type: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @ApiProperty()
  readonly value: number;

  @IsDate()
  @ApiProperty()
  readonly startDate: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  readonly endDate: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  @ApiProperty()
  readonly minimumOrderAmount: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  readonly usageLimit: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty()
  usageLimitPerUser: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active: boolean;
}
