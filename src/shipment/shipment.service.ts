import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Interfaces */
import { IBaseService } from '@commons/interfaces/i-base-service';

/* Entities */
import { Shipment } from './entities/shipment.entity';
import { Sale } from '@sale/entities/sale.entity';
import { ShippingCompany } from '@shipping_company/entities/shipping-company.entity';

/* DTO's */
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

/* Types */
import { Result } from '@commons/types/result.type';

@Injectable()
export class ShipmentService
  implements IBaseService<Shipment, CreateShipmentDto, UpdateShipmentDto>
{
  constructor(
    @InjectRepository(Shipment)
    private readonly repo: Repository<Shipment>,
  ) {}

  async countAll() {
    const total = await this.repo.count();
    return { statusCode: HttpStatus.OK, total };
  }

  async count() {
    const total = await this.repo.count({
      where: {
        isDeleted: false,
      },
    });
    return { statusCode: HttpStatus.OK, total };
  }

  async findAll() {
    const [shipments, total] = await this.repo.findAndCount({
      relations: ['sale', 'shippingCompany', 'createdBy', 'updatedBy'],
      where: {
        isDeleted: false,
      },
      order: {
        shipmentDate: 'DESC',
      },
    });

    return {
      statusCode: HttpStatus.OK,
      data: shipments,
      total,
    };
  }

  async findAllByShippingCompanyId(
    id: ShippingCompany['id'],
  ): Promise<Result<Shipment[]>> {
    const shipments = await this.repo.find({
      relations: ['sale', 'shippingCompany', 'createdBy', 'updatedBy'],
      where: { shippingCompany: id, isDeleted: false },
    });
    return {
      statusCode: HttpStatus.OK,
      data: shipments,
    };
  }

  async findOne(id: Shipment['id']): Promise<Result<Shipment>> {
    const shipment = await this.repo.findOne({
      relations: ['sale', 'shippingCompany', 'createdBy', 'updatedBy'],
      where: { id, isDeleted: false },
    });
    if (!shipment) {
      throw new NotFoundException(`The Shipment with ID: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: shipment,
    };
  }

  async findOneByTrackingNumber(
    trackingNumber: string,
  ): Promise<Result<Shipment>> {
    const shipment = await this.repo.findOne({
      relations: ['sale', 'shippingCompany', 'createdBy', 'updatedBy'],
      where: { trackingNumber, isDeleted: false },
    });
    if (!shipment) {
      throw new NotFoundException(
        `The Shipment with tracking number: ${trackingNumber} not found`,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      data: shipment,
    };
  }

  async findOneBySaleId(id: Sale['id']): Promise<Result<Shipment>> {
    const shipment = await this.repo.findOne({
      relations: ['sale', 'shippingCompany', 'createdBy', 'updatedBy'],
      where: { sale: id, isDeleted: false },
    });
    if (!shipment) {
      throw new NotFoundException(`The Shipment with sale ID: ${id} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      data: shipment,
    };
  }

  async create(dto: CreateShipmentDto) {
    const newShipment = this.repo.create(dto);
    const shipment = await this.repo.save(newShipment);
    return {
      statusCode: HttpStatus.CREATED,
      data: shipment,
      message: 'The Shipment was created',
    };
  }

  async update(id: Shipment['id'], changes: UpdateShipmentDto) {
    const { data } = await this.findOne(id);
    this.repo.merge(data as Shipment, changes);
    const rta = await this.repo.save(data as Shipment);
    return {
      statusCode: HttpStatus.OK,
      data: rta,
      message: `The Shipment with id: ${id} has been modified`,
    };
  }

  async remove(id: Shipment['id']) {
    const { data } = await this.findOne(id);

    const changes = { isDeleted: true };
    this.repo.merge(data as Shipment, changes);
    await this.repo.save(data as Shipment);
    return {
      statusCode: HttpStatus.OK,
      message: `The Shipment with ID: ${id} has been deleted`,
    };
  }
}
