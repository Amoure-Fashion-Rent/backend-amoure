import prisma from '@/lib/database/prisma';
import { ProductStatus } from '@prisma/client';
export interface IInsertProduct {
  name: string;
  images: string[];
  description: string;
  retailPrice: number;
  rentPrice: number;
  size: string;
  color: string;
  status: ProductStatus;
  categoryId: number;
  ownerId: number;
  stylishNote: string;
}
export interface GetProductOption {
  id?: number;
  ids?: number[];
  ownerId?: number;
  categoryId?: number;
  search?: string;
  page?: number;
  take?: number;
  includeCategory?: boolean;
  includeOwner?: boolean;
}

export type IUpdateProduct = Partial<Omit<IInsertProduct, 'ownerId'>>;

export class ProductRepository {
  async create(data: IInsertProduct) {
    // @ts-ignore
    return await prisma.product.create({ data });
  }

  async update(productId: number, data: IUpdateProduct) {
    return await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    });
  }

  async getAll({ ids, includeCategory, includeOwner, search, page, take, ...option }: GetProductOption) {
    const skip = page && page - 1 > 0 ? (page - 1) * (take || 10) : 0;

    const [products, count] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          ...option,
          ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
          ...(ids ? { id: { in: ids } } : {}),
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          category: !!includeCategory,
          ...(includeOwner
            ? {
                owner: {
                  select: {
                    id: true,
                    fullName: true,
                  },
                },
              }
            : {}),
        },
        skip,
        take: take || 10,
      }),
      prisma.product.count({
        where: {
          ...option,
          ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
          ...(ids ? { id: { in: ids } } : {}),
        },
      }),
    ]);
    return { products, count };
  }

  async getOne({ includeCategory, includeOwner, ...option }: GetProductOption) {
    const data = await prisma.product.findFirst({
      where: {
        id: option.id,
      },
      include: {
        category: !!includeCategory,
        ...(includeOwner
          ? {
              owner: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            }
          : {}),
      },
    });

    const aggregations = await prisma.review.aggregate({
      where: {
        productId: option.id,
      },
      _avg: {
        rating: true,
      },
      _count: true,
    });

    return {
      ...data,
      ...aggregations,
    };
  }
}
