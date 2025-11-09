import { faker } from '@faker-js/faker';
import { Wishlist } from '@wishlist/entities/wishlist.entity';
import { CreateWishlistDto } from '@wishlist/dto/create-wishlist.dto';

import { generateProduct } from './product.faker';
import { generateUser } from './user.faker';

// Faker para CreateWishlistDto
export const createWishlist = (): CreateWishlistDto => ({
  product: faker.number.int({ min: 1, max: 1000 }),
});

// Faker para Wishlist entity
export const generateWishlist = (id: number = 1): Wishlist => ({
  id,
  user: generateUser(),
  product: generateProduct(),
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
