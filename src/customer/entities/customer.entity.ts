import { Entity, Column, OneToMany } from 'typeorm';

import { PersonEntity } from '@commons/entities/personEntity';

import { Sale } from '@sale/entities/sale.entity';
import { Wishlist } from '@wishlist/entities/wishlist.entity';

@Entity('customers')
export class Customer extends PersonEntity {
  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  neighborhood: string;

  @OneToMany(() => Sale, (items) => items.customer)
  sales?: Sale[];

  @OneToMany(() => Wishlist, (items) => items.customer)
  wishlists?: Wishlist[];
}
