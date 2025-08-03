import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { BaseEntity } from '@commons/entities/baseEntity';

import { Sale } from '@sale/entities/sale.entity';
import { ShippingCompany } from '@shipping_company/entities/shipping-company.entity';
import { User } from '@user/entities/user.entity';

import { ShipmentStatusEnum } from '@commons/enums/shipment-status.enum';

@Entity('shipments')
@Unique(['sale', 'shippingCompany'])
export class Shipment extends BaseEntity {
  @Column({
    name: 'tracking_number',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  trackingNumber: string;

  @Column({ name: 'shipment_date', type: 'timestamp', nullable: true })
  shipmentDate: Date;

  @Column({
    name: 'estimated_delivery_date',
    type: 'timestamp',
    nullable: true,
  })
  estimatedDeliveryDate: Date;

  @Column({
    type: 'enum',
    enum: ShipmentStatusEnum,
    default: ShipmentStatusEnum.LABEL_CREATED,
    nullable: false,
  })
  status: ShipmentStatusEnum;

  @ManyToOne(() => Sale, (sale) => sale.shipments)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(
    () => ShippingCompany,
    (shippingCompany) => shippingCompany.shipments,
  )
  @JoinColumn({ name: 'shipping_company_id' })
  shippingCompany: ShippingCompany;

  @ManyToOne(() => User, (user) => user.createdShipments)
  @JoinColumn({ name: 'created_by_user_id' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedShipments)
  @JoinColumn({ name: 'updated_by_user_id' })
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.deletedShipments)
  @JoinColumn({ name: 'deleted_by_user_id' })
  deletedBy: User;
}
