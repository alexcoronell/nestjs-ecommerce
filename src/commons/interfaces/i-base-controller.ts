import { Result } from '@commons/types/result.type';

export interface IBaseController<T, CreateDto, UpdateDto> {
  countAll(): Promise<Result<number>>;
  count(): Promise<Result<number>>;
  findAll(): Promise<Result<T[]>>;
  findOne(id: number): Promise<Result<T>>;
  create(payload: CreateDto): Promise<Result<T>>;
  update(id: number | string, payload: UpdateDto): Promise<Result<T>>;
  remove(id: number | string): Promise<Result<T>>;
}
