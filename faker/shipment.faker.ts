/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { faker } from '@faker-js/faker/.';

import { Shipment } from '@shipment/entities/shipment.entity';

import { CreateShipmentDto } from '@shipment/dto/create-shipment.dto';

import { ShipmentStatusEnum } from '@commons/enums/shipment-status.enum';

import { generateBaseEntity } from './base.faker';

export const createShipment = (): CreateShipmentDto => {
  return {
    trackingNumber: faker.lorem.word({ length: 1 }),
    shipmentDate: faker.date.past(),
    estimatedDeliveryDate: faker.date.future(),
    status: faker.helpers.arrayElement(Object.values(ShipmentStatusEnum)),
    sale: faker.number.int({ min: 1, max: 100 }),
    shippingCompany: faker.number.int({ min: 1, max: 10 }),
    createdBy: faker.number.int({ min: 1, max: 100 }),
    updatedBy: faker.number.int({ min: 1, max: 100 }),
    deletedBy: null,
  };
};

export const generateShipment = (id: number = 1): Shipment => ({
  ...createShipment(),
  ...generateBaseEntity(id),
  id,
});

export const generateManyShipments = (size: number): Shipment[] => {
  const shipments: Shipment[] = [];
  for (let i = 0; i < size; i++) {
    shipments.push(generateShipment(i + 1));
  }
  return shipments;
};
