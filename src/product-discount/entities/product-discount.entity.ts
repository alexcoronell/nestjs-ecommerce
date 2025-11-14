import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Product } from '@product/entities/product.entity';
import { Discount } from '@discount/entities/discount.entity';
import { User } from '@user/entities/user.entity';

@Entity('product_discounts')
@Unique(['product', 'discount'])
export class ProductDiscount {
  @PrimaryColumn({ name: 'product_id', type: 'int' })
  productId: number;

  @PrimaryColumn({ name: 'discount_id', type: 'int' })
  discountId: number;

  /**************************** Relations ****************************/
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.createdProductDiscounts, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @ManyToOne(() => Product, (product) => product.productDiscounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Discount, (discount) => discount.productDiscounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;
}
