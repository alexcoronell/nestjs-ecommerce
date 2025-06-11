/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@commons/entities/baseEntity';
import { User } from '@user/entities/user.entity';

@Entity('discounts')
export class Discount extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  code: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  @Column({ name: 'start_date', type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({
    name: 'minimum_order_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0,
  })
  minimumOrderAmount: number;

  @Column({
    name: 'usage_limit',
    type: 'int',
    nullable: true,
    default: null,
  })
  usageLimit: number;

  @Column({
    name: 'usage_limit_per_user',
    type: 'int',
    nullable: true,
    default: null,
  })
  usageLimitPerUser: number;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @ManyToOne(() => User, (user) => user.createdDiscounts)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedDiscounts)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedDiscounts)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;
}
