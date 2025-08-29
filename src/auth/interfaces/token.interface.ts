export interface PayloadToken {
  user: number;
  isAdmin: boolean;
  iat?: Date;
  exp?: Date;
}
