import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

/* Modules */
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { SupplierModule } from './supplier/supplier.module';
import { UserModule } from './user/user.module';

/* Config */
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [config],
      isGlobal: true,
    }),
    UserModule,
    DatabaseModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    SupplierModule,
    PaymentMethodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
