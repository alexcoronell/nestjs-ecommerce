import { LocalCustomerAuthGuard } from './local-customer-auth.guard';

describe('LocalCustomerAuthGuard', () => {
  it('should be defined', () => {
    expect(new LocalCustomerAuthGuard()).toBeDefined();
  });
});
