import { Wishlist } from '@prisma/client';
export interface PostWishlistResponse extends Wishlist {}
export interface GetWishlistResponse {
  wishlist: Wishlist[];
  count: number;
}
