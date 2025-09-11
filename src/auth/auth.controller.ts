/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

/* Services */
import { AuthService } from './auth.service';

/* Entities */
import { Customer } from '@customer/entities/customer.entity';
import { User } from '@user/entities/user.entity';

/* Guards */
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { LocalCustomerAuthGuard } from './guards/local-customer-auth/local-customer-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth/refresh-jwt-auth.guard';

/* Decorators */
import { NoAudit } from '@commons/decorators/no-audit.decorator';

@NoAudit()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  login(@Req() req: Request) {
    const { user } = req as any;
    return this.authService.generateJWT(user as User);
  }

  @UseGuards(LocalCustomerAuthGuard)
  @Post('customer/login')
  loginCustomer(@Req() req: Request) {
    const { customer } = req as any;
    return this.authService.generateCustomerJWT(customer as Customer);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.body);
  }
}
