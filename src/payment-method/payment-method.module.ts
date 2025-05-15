import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodService } from '@paymentMethod/payment-method.service';
import { PaymentMethodController } from '@paymentMethod/payment-method.controller';
import { PaymentMethod } from '@paymentMethod/entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
