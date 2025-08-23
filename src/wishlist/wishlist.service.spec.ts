/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/* Services */
import { WishlistService } from './wishlist.service';

/* Entity */
import { Wishlist } from './entities/wishlist.entity';

/* Faker */
import { generateWishlist, generateManyWishlists } from '@faker/wishlist.faker';

describe('WishlistService', () => {
  let service: WishlistService;
  let repository: Repository<Wishlist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getRepositoryToken(Wishlist),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<WishlistService>(WishlistService);
    repository = module.get<Repository<Wishlist>>(getRepositoryToken(Wishlist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find wishlist services', () => {
    it('findAll should return all wishlists', async () => {
      const wishlists = generateManyWishlists(5);
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([wishlists, 5]);

      const { statusCode, data, total } = await service.findAll();
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(wishlists);
      expect(total).toEqual(5);
    });

    it('findOneByCustomerAndProduct should return a wishlist', async () => {
      const customerId = 1;
      const productId = 2;
      const wishlist = generateManyWishlists(1);

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([wishlist, 1]);

      const { statusCode, data, total } =
        await service.findOneByCustomerAndProduct(customerId, productId);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { customer: customerId, product: productId },
      });
      expect(statusCode).toBe(200);
      expect(data).toEqual(wishlist);
      expect(total).toBe(1);
    });

    it('findOneByCustomerAndProduct should throw NotFoundException if Wishlist does not exist', async () => {
      const customerId = 1;
      const productId = 2;
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0]);

      await expect(
        service.findOneByCustomerAndProduct(customerId, productId),
      ).rejects.toThrow(NotFoundException);
    });

    it('findOne should throw NotFoundException if wishlist does not exist', async () => {
      const wishlistId = 999;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(wishlistId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('findAllByCustomer should return all wishlists for a customer', async () => {
      const customerId = 1;
      const wishlists = generateManyWishlists(5);
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([wishlists, 5]);

      const { statusCode, data, total } =
        await service.findAllByCustomer(customerId);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(wishlists);
      expect(total).toEqual(5);
    });

    it('findAllByProduct should return all wishlists for a product', async () => {
      const productId = 1;
      const wishlists = generateManyWishlists(5);
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([wishlists, 5]);

      const { statusCode, data, total } =
        await service.findAllByProduct(productId);
      expect(repository.findAndCount).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(wishlists);
      expect(total).toEqual(5);
    });

    it('findOne should return one item by id', async () => {
      const wishlist = generateWishlist();
      jest.spyOn(repository, 'findOne').mockResolvedValue(wishlist);

      const { statusCode, data } = await service.findOne(wishlist.id);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(statusCode).toBe(200);
      expect(data).toEqual(wishlist);
    });
  });

  describe('create wishlist services', () => {
    it('create should return a wishlist item', async () => {
      const mock = generateWishlist();

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0]);
      jest.spyOn(repository, 'create').mockReturnValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(mock);

      const { statusCode, data } = await service.create(mock);
      expect(statusCode).toBe(201);
      expect(data).toEqual(mock);
    });

    it('should throw ConflictException if wishlist item with same customer and product exists', async () => {
      const data = generateManyWishlists(1);
      jest.spyOn(service, 'findOneByCustomerAndProduct').mockResolvedValue({
        statusCode: 200,
        data,
        total: 1,
      });

      await expect(service.create(data[0])).rejects.toThrow(ConflictException);
    });
  });

  describe('remove wishlist services', () => {
    it('remove should delete a wishlist item and return success message', async () => {
      const wishlist = generateWishlist();
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ statusCode: 200, data: wishlist });
      jest.spyOn(repository, 'remove').mockResolvedValue(wishlist);

      const result = await service.remove(wishlist.id);
      expect(service.findOne).toHaveBeenCalledWith(wishlist.id);
      expect(repository.remove).toHaveBeenCalledWith(wishlist);
      expect(result).toEqual({
        statusCode: 200,
        message: `Wishlist with id: ${wishlist.id} deleted`,
      });
    });

    it('remove should throw NotFoundException if wishlist does not exist', async () => {
      const wishlistId = 999;
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(wishlistId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
