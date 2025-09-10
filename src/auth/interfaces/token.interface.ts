export interface PayloadToken {
  user: number;
  isAdmin: boolean;
  isCustomer: boolean;
  iat?: Date;
  exp?: Date;
}
