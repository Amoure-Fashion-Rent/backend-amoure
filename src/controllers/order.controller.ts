import { Router } from 'express';
import { validateRequest } from '@middlewares/validate.middleware';
import { handleRequest } from '@utils/handle-request';
import OrderService from '@/services/order.service';
import { ProductRepository } from '@/repositories/product.repository';
import OrderRepository from '@/repositories/order.repository';
import { AuthMiddleware, RequestWithUser } from '@middlewares/auth.middleware';
import { Role } from '@prisma/client';
import { getOrdersSchema, postOrderSchema } from '@/domain/schemas/order.schema';
class OrderController {
  public path = '/orders';
  public router = Router();
  private orderService: OrderService;
  private authMiddleware: AuthMiddleware;
  constructor() {
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();
    this.orderService = new OrderService(orderRepository, productRepository);
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  getAll = async (req: RequestWithUser) => {
    const orders = await this.orderService.getAll(req.query, req.user.id);
    return { data: orders };
  };

  postOrder = async (req: RequestWithUser) => {
    const createdOrder = await this.orderService.create(req.body, req.user.id);
    return { data: createdOrder };
  };

  initializeRoutes = () => {
    this.router.get(this.path, [this.authMiddleware.verify([Role.USER])], validateRequest(getOrdersSchema), handleRequest(this.getAll));
    this.router.post(this.path, [this.authMiddleware.verify([Role.USER])], validateRequest(postOrderSchema), handleRequest(this.postOrder));
  };
}

export default OrderController;
