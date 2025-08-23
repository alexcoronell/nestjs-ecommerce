import {
  Injectable,
  NotFoundException,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { Customer } from '@customer/entities/customer.entity';
import { Product } from '@product/entities/product.entity';
import { Wishlist } from './entities/wishlist.entity';

/* DTO's */
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>,
  ) {}

  async findAll() {
    const [wishlists, total] = await this.repo.findAndCount({
      relations: ['user', 'product'],
      order: { addedDate: 'DESC' },
    });
    return {
      statusCode: HttpStatus.OK,
      data: wishlists,
      total,
    };
  }

  async findOneByCustomerAndProduct(
    customerId: Customer['id'],
    productId: Product['id'],
  ) {
    const [wishlist, total] = await this.repo.findAndCount({
      where: { product: productId, customer: customerId },
    });

    if (total === 0) {
      throw new NotFoundException(
        `Wishlist not found for customer: ${customerId}, product: ${productId}`,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      data: wishlist,
      total,
    };
  }

  async findAllByCustomer(customerId: Customer['id']) {
    const [wishlists, total] = await this.repo.findAndCount({
      relations: ['product'],
      where: { customer: customerId },
    });
    return {
      statusCode: HttpStatus.OK,
      data: wishlists,
      total,
    };
  }

  async findAllByProduct(productId: Product['id']) {
    const [wishlists, total] = await this.repo.findAndCount({
      relations: ['user'],
      where: { product: productId },
    });
    return {
      statusCode: HttpStatus.OK,
      data: wishlists,
      total,
    };
  }

  async findOne(id: number) {
    const wishlist = await this.repo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: wishlist,
    };
  }

  async create(dto: CreateWishlistDto) {
    const { customer, product } = dto;
    try {
      await this.findOneByCustomerAndProduct(customer, product);
      throw new ConflictException(
        'Wishlist item already exists for this customer and product',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        const newItem = this.repo.create(dto);
        const data = await this.repo.save(newItem);
        return {
          statusCode: HttpStatus.CREATED,
          data,
          message: 'Wishlist item created',
        };
      }
      throw error;
    }
  }

  async remove(id: number) {
    const { data } = await this.findOne(id);
    await this.repo.remove(data);
    return {
      statusCode: HttpStatus.OK,
      message: `Wishlist with id: ${id} deleted`,
    };
  }
}
