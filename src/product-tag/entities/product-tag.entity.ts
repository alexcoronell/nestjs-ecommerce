import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '@product/entities/product.entity';
import { Tag } from '@tag/entities/tag.entity';
import { User } from '@user/entities/user.entity';

@Entity('products_tags')
export class ProductTag {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.tags)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  products: number;

  @ManyToOne(() => Tag, (Tag) => Tag.products)
  @JoinColumn({ name: 'tag_id' })
  tags: number;

  @ManyToOne(() => User, (user) => user.createdProductsTags)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;
}
