import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { ProductTag } from '@product_tag/entities/product-tag.entity';
import { User } from '@user/entities/user.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  /**************************** Relations ****************************/
  @ManyToOne(() => User, (user) => user.createdTags)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedTags)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.deletedTags)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: User | null;

  @OneToMany(() => ProductTag, (items) => items.tag)
  product: ProductTag[];
}
