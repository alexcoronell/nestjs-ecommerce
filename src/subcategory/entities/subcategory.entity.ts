import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@commons/entities/baseEntity';
import { Category } from '@category/entities/category.entity';
import { User } from '@user/entities/user.entity';
import { Product } from '@product/entities/product.entity';

@Entity('subcategories')
export class Subcategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  /**************************** Relations ****************************/
  @ManyToOne(() => Category, (item) => item.subcategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, (user) => user.createdSubcategories)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedSubcategories)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.deletedSubcategories)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: User | null;

  /* Products */
  @OneToMany(() => Product, (items) => items.category)
  products: Product[];
}
