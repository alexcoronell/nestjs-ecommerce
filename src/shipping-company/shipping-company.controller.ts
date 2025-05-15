import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingCompanyService } from './shipping-company.service';
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import { UpdateShippingCompanyDto } from './dto/update-shipping-company.dto';

@Controller('shipping-company')
export class ShippingCompanyController {
  constructor(private readonly shippingCompanyService: ShippingCompanyService) {}

  @Post()
  create(@Body() createShippingCompanyDto: CreateShippingCompanyDto) {
    return this.shippingCompanyService.create(createShippingCompanyDto);
  }

  @Get()
  findAll() {
    return this.shippingCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingCompanyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingCompanyDto: UpdateShippingCompanyDto) {
    return this.shippingCompanyService.update(+id, updateShippingCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingCompanyService.remove(+id);
  }
}
