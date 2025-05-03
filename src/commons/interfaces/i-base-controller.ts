export interface IBaseController<T, CreateDto, UpdateDto> {
  countAll(): Promise<{ statusCode: number; total: number }>;
  count(): Promise<{ statusCode: number; total: number }>;
  getAll(): Promise<{ statusCode: number; data: T[]; total: number }>;
  get(id: number | string): Promise<{ statusCode: number; data: T | null }>;
  create(
    payload: CreateDto,
  ): Promise<{ statusCode: number; message: string; data: T }>;
  update(
    id: number | string,
    payload: UpdateDto,
  ): Promise<{ statusCode: number; message: string; data: T }>;
  remove(id: number | string): Promise<{ statusCode: number; message: string }>;
}
