import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '@product/entities/product.entity';
import { Tag } from '@tag/entities/tag.entity';
import { User } from '@user/entities/user.entity';

@Entity('products_tags')
export class ProductTag {
  @PrimaryColumn({ name: 'product_id' })
  productId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.createdProductsTags)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => Product, (product) => product.tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  products: number;

  @ManyToOne(() => Tag, (tag) => tag.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tags: number;
}
