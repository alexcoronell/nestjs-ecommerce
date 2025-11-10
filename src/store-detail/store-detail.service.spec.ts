/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { StoreDetailService } from './store-detail.service';

/* Entity */
import { StoreDetail } from './entities/store-detail.entity';
import { User } from '@user/entities/user.entity';

/* DTO's */
import { UpdateStoreDetailDto } from './dto/update-store-detail.dto';

/* Faker */
import { generateStoreDetail } from '@faker/storeDetail.faker';

describe('StoreDetailService', () => {
  let service: StoreDetailService;
  let repository: Repository<StoreDetail>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreDetailService,
        {
          provide: getRepositoryToken(StoreDetail),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<StoreDetailService>(StoreDetailService);
    repository = module.get<Repository<StoreDetail>>(
      getRepositoryToken(StoreDetail),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find Store Details services', () => {
    it('findOne should return a brand', async () => {
      const mock = generateStoreDetail();
      const id = mock.id;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);

      const { statusCode, data } = await service.findOne(id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        relations: ['createdBy', 'updatedBy'],
        where: { id },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(mock);
    });

    it('findOne should throw NotFoundException if Store Detail does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Store Details not found`);
      }
    });

    it('findOne should throw NotFoundException if Store Detail does not exist with Rejects', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrowError(
        new NotFoundException(`Store Details not found`),
      );
    });
  });

  describe('update Store Details services', () => {
    it('update should return message: have been modified', async () => {
      const mock = generateStoreDetail();
      const id = mock.id;
      const userId: User['id'] = 1;
      const changes: UpdateStoreDetailDto = { name: 'newName' };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mock);
      jest.spyOn(repository, 'merge').mockReturnValue({ ...mock, ...changes });
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, message } = await service.update(id, userId, changes);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(message).toEqual(`Store Details has been modified`);
    });

    it('update should throw NotFoundException if Store Details does not exist', async () => {
      const id = 1;
      const userId: User['id'] = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.update(id, userId, { name: 'newName' });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Store Details not found`);
      }
    });
  });
});
