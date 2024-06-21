import { ProductRepository } from '@/repositories/product.repository';
import OrderRepository, { GetOrderOption } from '@/repositories/order.repository';
import { CreateOrderRequest } from '@/domain/dtos/order.dto';
import dayjs from 'dayjs';
import BadRequest from '@errors/bad-request.error';
import { OrderStatus, ProductStatus } from '@prisma/client';

class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  getAll = async (option: GetOrderOption, userId: number) => {
    return await this.orderRepository.getAll({ ...option, userId });
  };

  create = async (data: CreateOrderRequest, userId: number) => {
    const rentalDuration = this.getDaysDifference(data.rentalStartDate, data.rentalEndDate);
    const product = await this.productRepository.getOne({ id: data.productId });
    if (!product) {
      throw new BadRequest(`Invalid product id: ${data.productId}`);
    }

    if (product.status !== ProductStatus.AVAILABLE) {
      throw new BadRequest('Product is unavailable');
    }

    const order = {
      userId,
      productId: data.productId,
      productName: product.name,
      productSize: product.size,
      productColor: product.color,
      rentPrice: Number(product.rentPrice),
      deliveryMethod: 'FREE',
      deliveryPrice: 0,
      totalPrice: Number(product.rentPrice),
      rentalStartDate: data.rentalStartDate,
      rentalEndDate: data.rentalEndDate,
      rentalDuration,
      status: OrderStatus.PENDING,
    };

    const createdOrder = await this.orderRepository.create(order);
    await this.productRepository.update(data.productId, { status: ProductStatus.ON_RENT });
    return createdOrder;
  };

  getDaysDifference(rentStart: Date, rentEnd: Date): number {
    const now = dayjs();
    const dayjsDate1 = dayjs(rentStart);
    const dayjsDate2 = dayjs(rentEnd);

    if (!dayjsDate1.isAfter(now) && !dayjsDate1.isSame(now, 'day')) {
      throw new BadRequest('Rent start date is invalid');
    }

    if (!dayjsDate1.isBefore(dayjsDate2)) {
      throw new BadRequest('Rent start date should be earlier than rent end date');
    }

    return dayjsDate2.diff(dayjsDate1, 'day');
  }
}

export default OrderService;
