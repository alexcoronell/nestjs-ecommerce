import { Injectable } from '@nestjs/common';
import { CreateStoreDetailDto } from './dto/create-store-detail.dto';
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

@Injectable()
export class StoreDetailService {
  create(createStoreDetailDto: CreateStoreDetailDto) {
    return 'This action adds a new storeDetail';
  }

  findAll() {
    return `This action returns all storeDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storeDetail`;
  }

  update(id: number, updateStoreDetailDto: UpdateStoreDetailDto) {
    return `This action updates a #${id} storeDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeDetail`;
  }
}
