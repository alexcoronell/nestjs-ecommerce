import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseDetail } from '@purchase_detail/entities/purchase-detail.entity';
import { Supplier } from '@supplier/entities/supplier.entity';
import { User } from '@user/entities/user.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'purchase_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  purchaseDate: Date;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  totalAmount: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  /**************************** Relations ****************************/
  @ManyToOne(() => User, (user) => user.createdPurchases, { nullable: false })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedPurchases, { nullable: false })
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.deletedPurchases, { nullable: true })
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: User | null;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchases, {
    nullable: false,
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => PurchaseDetail, (detail) => detail.purchase)
  purchaseDetails: PurchaseDetail[];
}
