import { Result } from '@commons/types/result.type';
import { AuthRequest } from '@auth/interfaces/auth-request.interface';

export interface IBaseController<T, CreateDto, UpdateDto> {
  countAll(): Promise<Result<number>>;
  count(): Promise<Result<number>>;
  findAll(): Promise<Result<T[]>>;
  findOne(id: number): Promise<Result<T>>;
  create(
    payload: CreateDto | CreateDto[],
    req: AuthRequest,
  ): Promise<Result<T>> | Promise<Result<T[]>>;
  update(
    id: number | string,
    req: AuthRequest,
    payload: UpdateDto,
  ): Promise<Result<T>>;
  remove(id: number | string, req: AuthRequest): Promise<Result<T>>;
}
