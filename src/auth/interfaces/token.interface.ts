import { UserRoleEnum } from '@commons/enums/user-role.enum';

export interface PayloadToken {
  user: number;
  role: UserRoleEnum;
  iat?: Date;
  exp?: Date;
}
