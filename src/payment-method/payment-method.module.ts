import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodService } from '@payment_method/payment-method.service';
import { PaymentMethodController } from '@payment_method/payment-method.controller';
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
