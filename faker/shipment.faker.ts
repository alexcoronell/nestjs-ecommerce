import { faker } from '@faker-js/faker/.';

/* Entity */
import { Shipment } from '@shipment/entities/shipment.entity';

/* DTO */
import { CreateShipmentDto } from '@shipment/dto/create-shipment.dto';

/* Enums */
import { ShipmentStatusEnum } from '@commons/enums/shipment-status.enum';

/* Fakers */
import { generateBaseEntity } from './base.faker';
import { generateSale } from './sale.faker';
import { generateShippingCompany } from './shippingCompany.faker';
import { generateUser } from './user.faker';

export const createShipment = (): CreateShipmentDto => {
  return {
    trackingNumber: faker.lorem.word({ length: 1 }),
    shipmentDate: faker.date.past(),
    estimatedDeliveryDate: faker.date.future(),
    status: faker.helpers.arrayElement(Object.values(ShipmentStatusEnum)),
    sale: faker.number.int({ min: 1, max: 100 }),
    shippingCompany: faker.number.int({ min: 1, max: 10 }),
  };
};

export const generateShipment = (id: number = 1): Shipment => ({
  ...createShipment(),
  ...generateBaseEntity(id),
  id,
  sale: generateSale(),
  shippingCompany: generateShippingCompany(),
  createdBy: generateUser(),
  updatedBy: generateUser(),
  deletedBy: null,
});

export const generateManyShipments = (size: number): Shipment[] => {
  const shipments: Shipment[] = [];
  for (let i = 0; i < size; i++) {
    shipments.push(generateShipment(i + 1));
  }
  return shipments;
};
