/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentMethod } from '@payment_method/entities/payment-method.entity';
import { User } from '@user/entities/user.entity';
import { ShippingCompany } from '@shipping_company/entities/shipping-company.entity';

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

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => User, (user) => user.cancelledSales)
  @JoinColumn({ name: 'cancelled_by_user_id' })
  cancelledBy: number | null;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.sales)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: number;

  @ManyToOne(() => ShippingCompany, (shippingCompany) => shippingCompany.sales)
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: number;
}
