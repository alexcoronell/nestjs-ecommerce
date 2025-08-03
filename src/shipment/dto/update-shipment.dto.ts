import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { CreateShipmentDto } from './create-shipment.dto';

export class UpdateShipmentDto extends PartialType(
  OmitType(CreateShipmentDto, ['createdBy', 'updatedBy', 'deletedBy'] as const),
) {}
