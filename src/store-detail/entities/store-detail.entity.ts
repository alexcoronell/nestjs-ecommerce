import {
  Entity,
  Check,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '@user/entities/user.entity';

@Entity('store_details')
@Check('"id" = 1')
export class StoreDetail {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  neighborhood: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  @Column({ name: 'legal_information', type: 'text', nullable: true })
  legalInformation: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  /**************************** Relations ****************************/
  @ManyToOne(() => User, (user) => user.createdStoreDetail, { nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User | null;

  @ManyToOne(() => User, (user) => user.updatedStoreDetail, { nullable: true })
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: User | null;
}
