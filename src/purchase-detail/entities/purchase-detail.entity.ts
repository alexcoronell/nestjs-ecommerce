import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

/* Base Entity */
import { BaseEntity } from '@commons/entities/baseEntity';

/* Entities */
import { Purchase } from '@purchase/entities/purchase.entity';
import { Product } from '@product/entities/product.entity';

@Entity('purchase_details')
@Unique(['purchase', 'product'])
export class PurchaseDetail extends BaseEntity {
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
    name: 'subtotal',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  subtotal: number;

  /**************************** Relations ****************************/
  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseDetails, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @ManyToOne(() => Product, (product) => product.purchaseDetails, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
