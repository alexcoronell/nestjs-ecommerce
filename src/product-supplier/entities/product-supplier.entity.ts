/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@commons/entities/baseEntity';
import { Product } from '@product/entities/product.entity';
import { Supplier } from '@supplier/entities/supplier.entity';
import { User } from '@user/entities/user.entity';
@Entity('product_suppliers')
export class ProductSupplier extends BaseEntity {
  @Column({
    name: 'supplier_product_code',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  supplierProductCode: string;

  @Column({ name: 'cost_price', type: 'decimal', precision: 10, default: 0 })
  costPrice: number;

  @Column({ name: 'is_primary_supplier', type: 'boolean', default: false })
  isPrimarySupplier: boolean;

  @ManyToOne(() => Product, (product) => product.productSuppliers)
  @JoinColumn({ name: 'product_id' })
  product: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.productSuppliers)
  @JoinColumn({ name: 'supplier_id' })
  supplier: number;

  @ManyToOne(() => User, (user) => user.createdProductSuppliers)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedProductSuppliers)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedProductSuppliers)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;
}
