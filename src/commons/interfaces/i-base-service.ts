/* Types */
import { Result } from '@commons/types/result.type';
import { PaginationOptions } from '@commons/types/pagination-options.type';
import { User } from '@user/entities/user.entity';

export interface IBaseService<T, CreateDto, UpdateDto> {
  countAll(): Promise<Result<number>>;
  count(): Promise<Result<number>>;
  findAll(options?: PaginationOptions): Promise<Result<T[]>>;
  findOne(id: number): Promise<Result<T>>;
  create(
    data: CreateDto | CreateDto[],
  ): Promise<Result<T>> | Promise<Result<T[]>>;
  update(id: number, data: UpdateDto): Promise<Result<T>>;
  remove(
    id: number,
    deletedBy: User['id'],
  ): Promise<{ statusCode: number; message: string }>;
}
