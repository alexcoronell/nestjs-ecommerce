/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Entity, Column, OneToMany } from 'typeorm';

import { PersonEntity } from '@commons/entities/personEntity';

import { Wishlist } from '@wishlist/entities/wishlist.entity';

@Entity('customers')
export class Customer extends PersonEntity {
  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  neighborhood: string;

  @OneToMany(() => Wishlist, (items) => items.customer)
  wishlists?: Wishlist[];
}
