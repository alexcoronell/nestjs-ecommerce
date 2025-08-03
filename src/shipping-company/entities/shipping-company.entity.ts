/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';
import { Sale } from '@sale/entities/sale.entity';
import { Shipment } from '@shipment/entities/shipment.entity';
import { User } from '@user/entities/user.entity';

@Entity('shipping_companies')
export class ShippingCompany extends BaseEntity {
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

  @ManyToOne(() => User, (user) => user.createdShippingCompanies)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.updatedShippingCompanies)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: number;

  @ManyToOne(() => User, (user) => user.deletedShippingCompanies)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: number | null;

  @OneToMany(() => Sale, (sales) => sales.shippingCompany)
  sales: Sale[];

  @OneToMany(() => Shipment, (shipment) => shipment.shippingCompany)
  shipments: Shipment[];
}
