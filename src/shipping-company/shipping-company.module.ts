import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingCompanyService } from './shipping-company.service';
import { ShippingCompanyController } from './shipping-company.controller';
import { ShippingCompany } from './entities/shipping-company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingCompany])],
  controllers: [ShippingCompanyController],
  providers: [ShippingCompanyService],
})
export class ShippingCompanyModule {}
