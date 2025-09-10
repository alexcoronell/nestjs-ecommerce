/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@auth/auth.service';

@Injectable()
export class LocalCustomerStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const customer = await this.authService.validateUser(email, password);
    if (!customer) {
      throw new UnauthorizedException('Not Allow');
    }
    return customer;
  }
}
