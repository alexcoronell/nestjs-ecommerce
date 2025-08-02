/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { ProductSupplier } from '@product_supplier/entities/product-supplier.entity';
import { Purchase } from '@purchase/entities/purchase.entity';
import { User } from '@user/entities/user.entity';

@Entity('suppliers')
export class Supplier extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({
    name: 'contact_name',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  contactName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ManyToOne(() => User, (user) => user.createdSuppliers)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedSuppliers)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedSuppliers)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;

  @OneToMany(() => ProductSupplier, (items) => items.supplier)
  productSuppliers: ProductSupplier[];

  @OneToMany(() => Purchase, (items) => items.supplier)
  purchases: Purchase[];
}
