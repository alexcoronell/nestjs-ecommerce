import { Injectable } from '@nestjs/common';
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

@Injectable()
export class StoreDetailService {
  findOne(id: number) {
    return `This action returns a #${id} storeDetail`;
  }

  update(id: number, updateStoreDetailDto: UpdateStoreDetailDto) {
    return `This action updates a #${id} storeDetail`;
  }
}
