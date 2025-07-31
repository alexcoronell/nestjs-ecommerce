/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Sale } from '@sale/entities/sale.entity';
import { Product } from '@product/entities/product.entity';
import { User } from '@user/entities/user.entity';

@Entity('sale_detail')
@Unique(['sale', 'product'])
export class SaleDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'quantity',
    type: 'int',
    default: 1,
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  subtotal: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Sale, (sale) => sale.details, { nullable: false })
  @JoinColumn({ name: 'sale_id' })
  sale: number;

  @ManyToOne(() => Product, (product) => product.saleDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: number;

  @ManyToOne(() => User, (user) => user.createdSaleDetails, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: number;
}
