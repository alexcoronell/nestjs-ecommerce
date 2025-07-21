import { faker } from '@faker-js/faker';
import { Wishlist } from '@wishlist/entities/wishlist.entity';
import { CreateWishlistDto } from '@wishlist/dto/create-wishlist.dto';
import { User } from '@user/entities/user.entity';
import { Product } from '@product/entities/product.entity';

// Faker para CreateWishlistDto
export const createWishlist = (): CreateWishlistDto => ({
  user: faker.number.int({ min: 1, max: 1000 }),
  product: faker.number.int({ min: 1, max: 1000 }),
});

// Faker para Wishlist entity
export const generateWishlist = (id: number = 1): Wishlist => ({
  id,
  user: { id: faker.number.int({ min: 1, max: 1000 }) } as User,
  product: { id: faker.number.int({ min: 1, max: 1000 }) } as Product,
  addedDate: faker.date.recent(),
});

// Faker para muchos Wishlists
export const generateManyWishlists = (size: number): Wishlist[] => {
  const wishlists: Wishlist[] = [];
  for (let i = 0; i < size; i++) {
    wishlists.push(generateWishlist(i + 1));
  }
  return wishlists;
};
