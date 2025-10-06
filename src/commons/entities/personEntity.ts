import { Column } from 'typeorm';

import { BaseEntity } from './baseEntity';

export class PersonEntity extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstname: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastname: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string | undefined;

  @Column({ name: 'phone_number', type: 'varchar', length: 255 })
  phoneNumber: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
