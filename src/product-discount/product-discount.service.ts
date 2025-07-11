import { Injectable } from '@nestjs/common';
import { CreateProductDiscountDto } from './dto/create-product-discount.dto';

@Injectable()
export class ProductDiscountService {
  create(createProductDiscountDto: CreateProductDiscountDto) {
    return 'This action adds a new productDiscount';
  }

  findAll() {
    return `This action returns all productDiscount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productDiscount`;
  }

  remove(id: number) {
    return `This action removes a #${id} productDiscount`;
  }
}
