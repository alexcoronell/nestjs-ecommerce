/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { User } from '@user/entities/user.entity';

@Entity('payment_methods')
export class PaymentMethod extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.createdPaymentMethods)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedPaymentMethods)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedPaymentMethods)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;
}
