import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Product } from '@product/entities/product.entity';
import { User } from '@user/entities/user.entity';

@Entity('wishlist')
@Unique(['user', 'product'])
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  /**************************** Relations ****************************/
  @ManyToOne(() => User, (user) => user.wishlists, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlists, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    name: 'added_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  addedDate: Date;
}
