/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { Category } from '@category/entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstname: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string | undefined;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  neighborhood: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**************************** Relations ****************************/
  /* Users */
  @ManyToOne(() => User, (user) => user.createdUsers)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedUsers)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedUsers)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;

  @OneToMany(() => User, (users) => users.createdBy)
  createdUsers: User[];

  @OneToMany(() => User, (users) => users.updatedBy)
  updatedUsers: User[];

  @OneToMany(() => User, (users) => users.deletedBy)
  deletedUsers: User[];

  /* Categories */
  @OneToMany(() => Category, (categories) => categories.createdBy)
  createdCategories: Category[];

  @OneToMany(() => Category, (categories) => categories.updatedBy)
  updatedCategories: Category[];

  @OneToMany(() => Category, (categories) => categories.deletedBy)
  deletedCategories: Category[];

  /* Brands */
  @OneToMany(() => Brand, (brands) => brands.createdBy)
  createdBrands: Brand[];

  @OneToMany(() => Brand, (brands) => brands.updatedBy)
  updatedBrands: Brand[];

  @OneToMany(() => Brand, (brands) => brands.deletedBy)
  deletedBrands: Brand[];
}
