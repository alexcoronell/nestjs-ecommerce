export interface PayloadToken {
  admin: boolean;
  user: number;
  iat?: Date;
  exp?: Date;
}
