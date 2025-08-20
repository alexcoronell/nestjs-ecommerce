import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Customer } from '@customer/entities/customer.entity';
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';
import { Shipment } from '@shipment/entities/shipment.entity';
import { ShippingCompany } from '@shipping_company/entities/shipping-company.entity';
import { SaleDetail } from '@sale_detail/entities/sale-detail.entity';
import { User } from '@user/entities/user.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'sale_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  saleDate: Date;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({
    name: 'shipping_address',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  shippingAddress: string;

  @Column({
    name: 'billing_status',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  shippingStatus: string;

  @UpdateDateColumn({
    name: 'cancelled_at',
    type: 'timestamp',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
    default: null,
  })
  cancelledAt: Date | null;

  @Column({
    name: 'is_cancelled',
    type: 'boolean',
    default: false,
  })
  isCancelled: boolean;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'customer_id' })
  customer: number;

  @ManyToOne(() => User, (user) => user.cancelledSales)
  @JoinColumn({ name: 'cancelled_by_user_id' })
  cancelledBy: number | null;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.sales)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: number;

  @ManyToOne(() => ShippingCompany, (shippingCompany) => shippingCompany.sales)
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: number;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
  details: SaleDetail[];

  @OneToMany(() => Shipment, (shipment) => shipment.sale)
  shipments: Shipment[];
}
