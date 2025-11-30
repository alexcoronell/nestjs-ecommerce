/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

/* Controller */
import { WishlistController } from './wishlist.controller';

/* Services */
import { WishlistService } from './wishlist.service';

/* Entities */
import { Wishlist } from './entities/wishlist.entity';

/* DTO's */
import { CreateWishlistDto } from './dto/create-wishlist.dto';

/* Faker */
import {
  createWishlist,
  generateWishlist,
  generateManyWishlists,
} from '@faker/wishlist.faker';

describe('WishlistController', () => {
  let controller: WishlistController;
  let service: WishlistService;

  const mockWishlist: Wishlist = generateWishlist();
  const mockWishlists: Wishlist[] = generateManyWishlists(10);
  const mockNewWishlist: CreateWishlistDto = createWishlist();

  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockWishlists),
    findOneByUserAndProduct: jest.fn().mockResolvedValue(mockWishlist),
    findAllByUser: jest.fn().mockResolvedValue(mockWishlists),
    findAllByProduct: jest.fn().mockResolvedValue(mockWishlists),
    findOne: jest.fn().mockResolvedValue(mockWishlist),
    create: jest.fn().mockResolvedValue(mockNewWishlist),
    remove: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find wishlist controllers', () => {
    it('should call findAll wishlist service', async () => {
      expect(await controller.findAll()).toEqual(mockWishlists);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should call findOneByUserAndProduct wishlist service', async () => {
      expect(
        await controller.findOneByUserAndProduct(
          mockWishlist.user.id,
          mockWishlist.product.id,
        ),
      ).toEqual(mockWishlist);
      expect(service.findOneByUserAndProduct).toHaveBeenCalledWith(
        mockWishlist.user.id,
        mockWishlist.product.id,
      );
    });

    it('should call findAllByUser wishlist service', async () => {
      expect(await controller.findAllByUser(mockWishlist.user.id)).toEqual(
        mockWishlists,
      );
      expect(service.findAllByUser).toHaveBeenCalledWith(mockWishlist.user.id);
    });

    it('should call findAllByProduct wishlist service', async () => {
      expect(
        await controller.findAllByProduct(mockWishlist.product.id),
      ).toEqual(mockWishlists);
      expect(service.findAllByProduct).toHaveBeenCalledWith(
        mockWishlist.product.id,
      );
    });

    it('should call findOne wishlist service', async () => {
      expect(await controller.findOne(mockWishlist.id)).toEqual(mockWishlist);
      expect(service.findOne).toHaveBeenCalledWith(mockWishlist.id);
    });
  });

  describe('create wishlist controller', () => {
    it('should call create wishlist service', async () => {
      const userId = 1;
      expect(await controller.create(mockNewWishlist, userId)).toEqual(
        mockNewWishlist,
      );
    });
  });

  describe('remove wishlist controller', () => {
    it('should call remove wishlist service', async () => {
      expect(await controller.remove(mockWishlist.id)).toEqual(1);
      expect(service.remove).toHaveBeenCalledWith(mockWishlist.id);
    });
  });
});
