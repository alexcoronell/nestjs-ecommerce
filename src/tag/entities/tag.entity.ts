/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { User } from '@user/entities/user.entity';

@Entity('tags')
export class Tag extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.createdTags)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedTags)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedTags)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;
}
