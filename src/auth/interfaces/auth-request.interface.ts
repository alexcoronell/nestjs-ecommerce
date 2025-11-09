import { Request } from 'express';
import { PayloadToken } from './token.interface';

export interface AuthRequest extends Request {
  user: PayloadToken['user'];
}
