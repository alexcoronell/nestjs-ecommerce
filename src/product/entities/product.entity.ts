/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@commons/entities/baseEntity';
import { Brand } from '@brand/entities/brand.entity';
import { Category } from '@category/entities/category.entity';
import { Subcategory } from '@subcategory/entities/subcategory.entity';
import { ProductImage } from '@product_images/entities/product-image.entity';
import { ProductSupplier } from '@product_supplier/entities/product-supplier.entity';
import { ProductTag } from '@product_tag/entities/product-tag.entity';
import { User } from '@user/entities/user.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, default: 0 })
  price: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  stock: number;

  @ManyToOne(() => Category, (item) => item.products)
  @JoinColumn({ name: 'category_id' })
  category: number;

  @ManyToOne(() => Subcategory, (item) => item.products)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: number;

  @ManyToOne(() => Brand, (item) => item.products)
  @JoinColumn({ name: 'brand_id' })
  brand: number;

  @ManyToOne(() => User, (user) => user.createdProducts)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedProducts)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedProducts)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;

  @OneToMany(() => ProductImage, (items) => items.product)
  images: ProductImage[];

  @OneToMany(() => ProductSupplier, (items) => items.product)
  productSuppliers: ProductSupplier[];

  @OneToMany(() => ProductTag, (items) => items.products)
  tags: ProductTag[];
}
