import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repo: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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
    const user = await this.userRepo.findOne({ where: { id: dto.user } });
    if (!user)
      throw new NotFoundException(`User with id: ${dto.user} not found`);

    const product = await this.productRepo.findOne({
      where: { id: dto.product },
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${dto.product} not found`);

    const wishlist = this.repo.create({
      user,
      product,
    });
    const saved = await this.repo.save(wishlist);
    return {
      statusCode: HttpStatus.CREATED,
      data: saved,
      message: 'Wishlist item created',
    };
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
