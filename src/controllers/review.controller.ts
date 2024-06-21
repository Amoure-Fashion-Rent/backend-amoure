import Controller from '@interfaces/controller';
import { validateRequest } from '@middlewares/validate.middleware';
import { handleRequest } from '@utils/handle-request';
import { Request, Router } from 'express';
import ReviewService from '@/services/review.service';
import { ReviewRepository } from '@/repositories/review.repository';
import { BaseResponse } from '@interfaces/base-response';
import { GetReviewResponse, PostReviewResponse } from '@/domain/dtos/review.dto';
import { AuthMiddleware, RequestWithUser } from '@middlewares/auth.middleware';
import { StatusCodes } from 'http-status-codes';
import { deleteReviewSchema, getReviewSchema, postReviewSchema } from '@/domain/schemas/review.schema';
import { Role } from '@prisma/client';
import { ProductRepository } from '@/repositories/product.repository';

class ReviewController implements Controller {
  public path = '/reviews';
  public router = Router();
  private reviewService: ReviewService;
  private authMiddleware: AuthMiddleware;
  constructor() {
    const reviewRepository = new ReviewRepository();
    const productRepository = new ProductRepository();
    this.reviewService = new ReviewService(reviewRepository, productRepository);
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  getAll = async (req: Request): Promise<BaseResponse<GetReviewResponse>> => {
    const reviews = await this.reviewService.getAll(req.query);
    return { data: reviews };
  };

  create = async (req: RequestWithUser): Promise<BaseResponse<PostReviewResponse>> => {
    const data = await this.reviewService.create(req.body, req.user.id);
    return { data, status: StatusCodes.CREATED, message: 'Review created successfully' };
  };

  delete = async (req: Request) => {
    await this.reviewService.delete(req.params.id, req.user.id);
    return { message: 'Review deleted successfully' };
  };

  initializeRoutes = () => {
    this.router.get(this.path, validateRequest(getReviewSchema), handleRequest(this.getAll));
    this.router.post(this.path, [this.authMiddleware.verify([Role.USER])], validateRequest(postReviewSchema), handleRequest(this.create));
    this.router.delete(
      `${this.path}/:id`,
      [this.authMiddleware.verify([Role.USER])],
      validateRequest(deleteReviewSchema),
      handleRequest(this.delete),
    );
  };
}

export default ReviewController;
