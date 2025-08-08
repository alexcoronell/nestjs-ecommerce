/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

/* Services */
import { AuthService } from './auth.service';

/* Entities */
import { User } from '@user/entities/user.entity';

/* Guards */
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth/refresh-jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    const { user } = req as any;
    return this.authService.generateJWT(user as User);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('validate-password')
  validatePassword(@Req() req: Request) {
    const { username, password } = req.body;
    return this.authService.validatePassword(username, password);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.body);
  }
}
