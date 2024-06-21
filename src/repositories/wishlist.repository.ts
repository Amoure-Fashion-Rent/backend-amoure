import prisma from '@/lib/database/prisma';

export interface IInsertWishlist {
  productId: number;
  userId: number;
}

export interface GetWishlistOption {
  userId: number; //required
  includeProducts?: boolean;
  page?: number;
  take?: number;
}

export class WishlistRepository {
  async create(data: IInsertWishlist) {
    return await prisma.wishlist.upsert({
      where: {
        productId_userId: data,
      },
      create: data,
      update: data,
    });
  }

  async getAll({ page, take, includeProducts, ...option }: GetWishlistOption) {
    const skip = page && page - 1 > 0 ? (page - 1) * (take || 10) : 0;
    const [wishlist, count] = await prisma.$transaction([
      prisma.wishlist.findMany({
        where: option,
        include: {
          product: !!includeProducts,
        },
        skip,
        take: take || 10,
      }),
      prisma.wishlist.count({
        where: option,
      }),
    ]);
    return { wishlist, count };
  }
}
