export type Result<T> = {
  statusCode: number;
  data?: T | T[];
  total?: number;
  message?: string;
  page?: number;
  lastPage?: number;
};
