/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { Subcategory } from '@subcategories/entities/subcategory.entity';
import { User } from '@user/entities/user.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.createdCategories)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedCategories)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedCategories)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;

  /* Subcategories */
  @OneToMany(() => Subcategory, (items) => items.createdBy)
  subcategories: Subcategory[];
}
