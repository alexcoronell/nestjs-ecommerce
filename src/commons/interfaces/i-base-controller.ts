import { Result } from '@commons/types/result.type';
import { RequestWithUser } from './request-with-user.interface';

export interface IBaseController<T, CreateDto, UpdateDto> {
  countAll(): Promise<Result<number>>;
  count(): Promise<Result<number>>;
  findAll(): Promise<Result<T[]>>;
  findOne(id: number): Promise<Result<T>>;
  create(
    payload: CreateDto | CreateDto[],
  ): Promise<Result<T>> | Promise<Result<T[]>>;
  update(id: number | string, payload: UpdateDto): Promise<Result<T>>;
  remove(id: number | string, req: RequestWithUser): Promise<Result<T>>;
}
