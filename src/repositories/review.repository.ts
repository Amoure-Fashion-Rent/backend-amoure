import prisma from '@/lib/database/prisma';

export interface GetReviewOption {
  id?: number;
  productId?: number;
  userId?: number;
  page?: number;
  take?: number;
  includeUser?: boolean;
}

export interface IInsertReview {
  rating: number;
  comment: string;
  userId: number;
  productId: number;
}
export class ReviewRepository {
  async getAll({ page, take, includeUser, ...option }: GetReviewOption) {
    const skip = page && page - 1 > 0 ? (page - 1) * (take || 10) : 0;
    const [reviews, count, average] = await prisma.$transaction([
      prisma.review.findMany({
        where: option,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: take || 10,
        ...(includeUser
          ? {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              },
            }
          : {}),
      }),
      prisma.review.count({
        where: option,
      }),
      prisma.review.aggregate({
        where: option,
        _avg: {
          rating: true,
        },
      }),
    ]);
    return { reviews, count, avgRating: average._avg.rating };
  }

  async getAverageRatingAndCount(productIds: number[]) {
    const data = await prisma.review.groupBy({
      by: 'productId',
      where: {
        id: {
          in: productIds,
        },
      },
      _avg: {
        rating: true,
      },
      _count: true,
    });
    return data.map(d => {
      return { avgRating: d._avg.rating, count: d._count, productId: d.productId };
    });
  }

  async create(data: IInsertReview) {
    return await prisma.review.create({ data });
  }

  async delete(id: number) {
    return await prisma.review.delete({ where: { id } });
  }

  async getOne({ page, take, ...option }: GetReviewOption) {
    return await prisma.review.findFirst({
      where: option,
    });
  }
}
