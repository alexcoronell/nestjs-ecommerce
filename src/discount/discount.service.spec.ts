import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { DiscountService } from '@discount/discount.service';

/* Entity */
import { Discount } from '@discount/entities/discount.entity';

/* DTO's */
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';

/* Faker */
import { generateDiscount, generateManyDiscounts } from '@faker/discount.faker';

describe('DiscountService', () => {
  let service: DiscountService;
  let repository: Repository<Discount>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountService,
        {
          provide: getRepositoryToken(Discount),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<DiscountService>(DiscountService);
    repository = module.get<Repository<Discount>>(getRepositoryToken(Discount));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
