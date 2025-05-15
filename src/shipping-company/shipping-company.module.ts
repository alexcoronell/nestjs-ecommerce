import { Module } from '@nestjs/common';
import { ShippingCompanyService } from './shipping-company.service';
import { ShippingCompanyController } from './shipping-company.controller';

@Module({
  controllers: [ShippingCompanyController],
  providers: [ShippingCompanyService],
})
export class ShippingCompanyModule {}
