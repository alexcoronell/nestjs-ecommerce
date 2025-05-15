import { Injectable } from '@nestjs/common';
import { CreateShippingCompanyDto } from './dto/create-shipping-company.dto';
import { UpdateShippingCompanyDto } from './dto/update-shipping-company.dto';

@Injectable()
export class ShippingCompanyService {
  create(createShippingCompanyDto: CreateShippingCompanyDto) {
    return 'This action adds a new shippingCompany';
  }

  findAll() {
    return `This action returns all shippingCompany`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingCompany`;
  }

  update(id: number, updateShippingCompanyDto: UpdateShippingCompanyDto) {
    return `This action updates a #${id} shippingCompany`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingCompany`;
  }
}
