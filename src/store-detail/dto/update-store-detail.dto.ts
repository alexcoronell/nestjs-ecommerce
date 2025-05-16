/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { PartialType } from '@nestjs/swagger';
import { CreateStoreDetailDto } from './create-store-detail.dto';

export class UpdateStoreDetailDto extends PartialType(CreateStoreDetailDto) {}
