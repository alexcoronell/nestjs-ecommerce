/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Customer } from '@customer/entities/customer.entity';
import { Product } from '@product/entities/product.entity';

@Entity('wishlist')
@Unique(['customer', 'product'])
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.wishlists, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: number;

  @ManyToOne(() => Product, (product) => product.wishlists, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: number;

  @Column({
    name: 'added_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  addedDate: Date;
}
