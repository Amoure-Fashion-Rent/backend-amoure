import Controller from '@interfaces/controller';
import { validateRequest } from '@middlewares/validate.middleware';
import { handleRequest } from '@utils/handle-request';
import { Router } from 'express';
import WishlistService from '@/services/wishlist.service';
import { WishlistRepository } from '@/repositories/wishlist.repository';
import { AuthMiddleware, RequestWithUser } from '@middlewares/auth.middleware';
import { BaseResponse } from '@interfaces/base-response';
import { GetWishlistResponse, PostWishlistResponse } from '@/domain/dtos/wishlist.dto';
import { ProductRepository } from '@/repositories/product.repository';
import { getWishlistSchema, postWishlistSchema } from '@/domain/schemas/wishlist.schema';
import { Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

class WishlistController implements Controller {
  public path = '/wishlist';
  public router = Router();
  private wishlistService: WishlistService;
  private authMiddleware: AuthMiddleware;
  constructor() {
    const wishlistRepository = new WishlistRepository();
    const productRepository = new ProductRepository();
    this.wishlistService = new WishlistService(wishlistRepository, productRepository);
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  postWishlist = async (request: RequestWithUser): Promise<BaseResponse<PostWishlistResponse>> => {
    const createdWishlist = await this.wishlistService.create(request.body, request.user.id);
    return { data: createdWishlist, status: StatusCodes.CREATED };
  };

  getAll = async (req: RequestWithUser): Promise<BaseResponse<GetWishlistResponse>> => {
    const wishlist = await this.wishlistService.getAll({ ...req.query, userId: req.user.id });
    return { data: wishlist };
  };

  initializeRoutes = () => {
    this.router.post(this.path, [this.authMiddleware.verify([Role.USER])], validateRequest(postWishlistSchema), handleRequest(this.postWishlist));
    this.router.get(this.path, [this.authMiddleware.verify([Role.USER])], validateRequest(getWishlistSchema), handleRequest(this.getAll));
  };
}

export default WishlistController;
