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

  /**************************** Relations ****************************/
  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'customer_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.cancelledSales)
  @JoinColumn({ name: 'cancelled_by_user_id' })
  cancelledBy: User | null;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.sales)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => ShippingCompany, (shippingCompany) => shippingCompany.sales)
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: ShippingCompany;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
  details: SaleDetail[];

  @OneToMany(() => Shipment, (shipment) => shipment.sale)
  shipments: Shipment[];
}
