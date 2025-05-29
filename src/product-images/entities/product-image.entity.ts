/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@commons/entities/baseEntity';
import { Product } from '@product/entities/product.entity';
import { User } from '@user/entities/user.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Column({ name: 'file_path', type: 'varchar', length: 256, nullable: false })
  filePath: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  title: string;

  @Column({ name: 'is_main', type: 'boolean', default: false })
  isMain: boolean;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'product_id' })
  product: number;

  @ManyToOne(() => User, (user) => user.uploadedProductImages)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedBy: number;
}
