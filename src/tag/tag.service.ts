import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Tag } from '@tag/entities/tag.entity';

/* DTO's */
import { CreateTagDto } from '@tag/dto/create-tag.dto';
import { UpdateTagDto } from '@tag/dto/update-tag.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class TagService
  implements IBaseService<Tag, CreateTagDto, UpdateTagDto>
{
  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async count() {
    const total = await this.repo.count({
      where: {
        isDeleted: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  async findAll() {
    const [data, total] = await this.repo.findAndCount({
      where: {
        isDeleted: false,
      },
      order: {
        name: 'ASC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data,
      total,
    };
  }

  async findOne(id: Tag['id']): Promise<Result<Tag>> {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!data) {
      throw new NotFoundException(`The Tag with id: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  async findOneByName(name: string): Promise<Result<Tag>> {
    const data = await this.repo.findOne({
      relations: ['createdBy', 'updatedBy'],
      where: { name, isDeleted: false },
    });
    if (!data) {
      throw new NotFoundException(`The Tag with name: ${name} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: data,
    };
  }

  async create(dto: CreateTagDto) {
    const newTag = this.repo.create({
      ...dto,
    });
    const data = await this.repo.save(newTag);
    return {
      statusCode: HttpStatus.CREATED,
      data,
      message: 'The Tag was created',
    };
  }

  async update(id: number, changes: UpdateTagDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Tag, changes);
    const rta = await this.repo.save(data as Tag);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Tag with id: ${id} has been modified`,
    };
  }

  async remove(id: Tag['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Tag, changes);
    await this.repo.save(data as Tag);
    return {
      statusCode: HttpStatus.OK,
      message: `The Tag with id: ${id} has been deleted`,
    };
  }
}
