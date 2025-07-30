import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
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
    const newItem = this.repo.create(dto);
    const data = await this.repo.save(newItem);
    return {
      statusCode: HttpStatus.CREATED,
      data,
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
