import { HttpStatus } from '@nestjs/common';

export type Result<T> = {
  statusCode: HttpStatus;
  data?: T | T[];
  total?: number;
  message?: string;
  page?: number;
  lastPage?: number;
};
