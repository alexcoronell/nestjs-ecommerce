/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from 'src/commons/entities/baseEntity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    name: 'address_street',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressStreet: string;

  @Column({
    name: 'address_city',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressCity: string;

  @Column({
    name: 'address_state',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressState: string;

  @Column({
    name: 'address_neighborhood',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  addressNeighborhood: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phoneNumber: string;
}
