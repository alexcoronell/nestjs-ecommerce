/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import config from '@config/index';

/* Services */
import { UserService } from '@user/user.service';

/* Entities */
import { User } from '@user/entities/user.entity';

/* Interfaces */
import { PayloadToken } from '@auth/interfaces/token.interface';

/* DTO's */
import { TokenDto } from '@auth/dto/token.dto';

@Injectable()
export class AuthService {
  jwtRefreshTokenSecret: string | null = null;
  jwtRefreshTokenExpirationTime: number | null = null;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    @Inject(config.KEY) configService: ConfigType<typeof config>,
  ) {
    this.jwtRefreshTokenSecret = configService.jwtRefreshTokenSecret ?? null;
    this.jwtRefreshTokenExpirationTime =
      configService.jwtRefreshTokenExpirationTime as unknown as number;
  }

  async validateUser(email: string, password: string) {
    const { data } = await this.userService.findOneByEmail(email);
    const user = data as User;
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rta } = user;
      return rta;
    }
    return null;
  }

  async validatePassword(email: string, password: string) {
    const { data } = await this.userService.findOneByEmail(email);
    const user = data as User;
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return true;
    }
    return false;
  }

  async generateJWT(user: User) {
    const payload: PayloadToken = { user: user.id };
    const expiresIn = 604800;
    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      refresh_token: await this.generateRefreshToken(payload),
    };
  }

  private async generateRefreshToken(payload: PayloadToken) {
    const secret = this.jwtRefreshTokenSecret;
    if (!secret) {
      throw new Error('JWT refresh token secret is not defined');
    }
    const expiresIn = 604800;
    const refreshToken = this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await refreshToken;
  }

  async refreshToken(dto: TokenDto) {
    const expiresIn = 60;
    const userToken = this.jwtService.decode(dto.refresh);
    const { user } = userToken as PayloadToken;
    const payload: PayloadToken = { user };
    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn }),
    };
  }
}
