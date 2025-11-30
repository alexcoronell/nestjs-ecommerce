import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Entities */
import { StoreDetail } from './entities/store-detail.entity';

/* DTO's */
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class StoreDetailService {
  constructor(
    @InjectRepository(StoreDetail)
    private readonly repo: Repository<StoreDetail>,
  ) {}

  async findOne(id: StoreDetail['id']): Promise<Result<StoreDetail>> {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`Store Details not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async update(id: number, userId: number, changes: UpdateStoreDetailDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as StoreDetail, {
      ...changes,
      updatedBy: { id: userId },
    });
    const rta = await this.repo.save(data as StoreDetail);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `Store Details has been modified`,
    };
  }
}
