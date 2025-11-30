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

/* Decorators */
import { UserId } from '@auth/decorators/user-id.decorator';

/* Services */
import { ShippingCompanyService } from './shipping-company.service';

/* Entities */
import { ShippingCompany } from './entities/shipping-company.entity';

/* DTO's */
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import { UpdateShippingCompanyDto } from './dto/update-shipping-company.dto';

@Controller('shipping-company')
export class ShippingCompanyController
  implements
    IBaseController<
      ShippingCompany,
      CreateShippingCompanyDto,
      UpdateShippingCompanyDto
    >
{
  constructor(
    private readonly shippingCompanyService: ShippingCompanyService,
  ) {}

  @Get('count-all')
  countAll() {
    return this.shippingCompanyService.countAll();
  }

  @Get('count')
  count() {
    return this.shippingCompanyService.count();
  }

  @Get()
  findAll() {
    return this.shippingCompanyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingCompanyService.findOne(+id);
  }

  @Get('name/:name')
  findOneByname(@Param('name') name: string) {
    return this.shippingCompanyService.findOneByName(name);
  }

  @Post()
  create(@Body() payload: CreateShippingCompanyDto, @UserId() userId: number) {
    return this.shippingCompanyService.create(payload, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @Body() updateCategoryDto: UpdateShippingCompanyDto,
  ) {
    return this.shippingCompanyService.update(+id, userId, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.shippingCompanyService.remove(+id, userId);
  }
}
