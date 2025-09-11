import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

/* Modules */
import { CustomerModule } from '@customer/customer.module';
import { UserModule } from '@user/user.module';

/* Strategies */
import { LocalStrategy } from '@auth/strategies/local.strategy';
import { LocalCustomerStrategy } from './strategies/local-customer.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '@auth/strategies/jwt-refresh-token.strategy';

/* Service */
import { AuthService } from '@auth/auth.service';

/* Controller */
import { AuthController } from '@auth/auth.controller';

/* Config */
import config from '@config/index';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: configService.jwtExpirationTime,
          },
        };
      },
    }),
    CustomerModule,
    UserModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    LocalCustomerStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
