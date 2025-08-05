import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

/* Interface */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { ShipmentService } from './shipment.service';

/* Entities */
import { Shipment } from './entities/shipment.entity';

/* DTO's */
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

@Controller('shipment')
export class ShipmentController
  implements IBaseController<Shipment, CreateShipmentDto, UpdateShipmentDto>
{
  constructor(private readonly shipmentService: ShipmentService) {}

  @Get('count-all')
  countAll() {
    return this.shipmentService.countAll();
  }

  @Get('count')
  count() {
    return this.shipmentService.count();
  }

  @Get()
  findAll() {
    return this.shipmentService.findAll();
  }

  @Get('shipping-company/:id')
  findAllByShippingCompanyId(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.findAllByShippingCompanyId(+id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.findOne(+id);
  }

  @Get('tracking-number/:tracking')
  findOneByTrackingNumber(@Param('tracking') tracking: string) {
    return this.shipmentService.findOneByTrackingNumber(tracking);
  }

  @Get('sale/:id')
  findOneBySaleId(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.findOneBySaleId(+id);
  }

  @Post()
  create(@Body() payload: CreateShipmentDto) {
    return this.shipmentService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateShipmentDto,
  ) {
    return this.shipmentService.update(+id, changes);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.remove(+id);
  }
}
