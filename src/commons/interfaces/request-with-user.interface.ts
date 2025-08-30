// src/common/interfaces/request.interface.ts
import { Request } from 'express';
import { PayloadToken } from '@auth/interfaces/token.interface'; // Ajusta la ruta a tu interfaz

export interface RequestWithUser extends Request {
  user: PayloadToken;
}
