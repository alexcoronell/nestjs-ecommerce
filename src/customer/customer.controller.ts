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
import { ApiTags } from '@nestjs/swagger';

/* Interfaces */
import { IBaseController } from '@commons/interfaces/i-base-controller';

/* Services */
import { CustomerService } from './customer.service';

/* Entities */
import { Customer } from './entities/customer.entity';

/* DTO's */
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password';

@ApiTags('Customers')
@Controller('customer')
export class CustomerController
  implements IBaseController<Customer, CreateCustomerDto, UpdateCustomerDto>
{
  constructor(private readonly customerService: CustomerService) {}

  @Get('count-all')
  countAll() {
    return this.customerService.countAll();
  }

  @Get('count')
  count() {
    return this.customerService.count();
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get('actives')
  findAllActives() {
    return this.customerService.findAllActives();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: Customer['id']) {
    return this.customerService.findOne(+id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.customerService.findOneByEmail(email);
  }

  @Post()
  create(@Body() payload: CreateCustomerDto) {
    return this.customerService.create(payload);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, changes);
  }

  @Patch('email/:id')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateCustomerPasswordDto,
  ) {
    return this.customerService.updatePassword(id, changes);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.remove(id);
  }
}
