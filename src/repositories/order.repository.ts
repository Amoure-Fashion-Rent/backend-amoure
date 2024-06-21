import { OrderStatus } from '@prisma/client';
import prisma from '@/lib/database/prisma';

export interface IInsertOrder {
  userId: number;
  productId: number;
  productName: string;
  productSize: string;
  productColor: string;
  rentPrice: number;
  deliveryMethod: string;
  deliveryPrice: number;
  totalPrice: number;
  rentalStartDate: Date;
  rentalEndDate: Date;
  rentalDuration: number;
  status: OrderStatus;
}

export interface GetOrderOption {
  id?: number;
  userId?: number;
  page?: number;
  take?: number;
  includeProduct?: boolean;
}
class OrderRepository {
  async create(data: IInsertOrder) {
    return await prisma.order.create({ data });
  }

  async getAll({ page, take, includeProduct, ...option }: GetOrderOption) {
    const skip = page && page - 1 > 0 ? (page - 1) * (take || 10) : 0;
    const [orders, count] = await prisma.$transaction([
      prisma.order.findMany({
        where: {
          ...option,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          product: !!includeProduct,
        },
        skip,
        take: take || 10,
      }),
      prisma.order.count({
        where: option,
      }),
    ]);
    return { orders, count };
  }
}

export default OrderRepository;
