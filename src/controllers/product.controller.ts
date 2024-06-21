import Controller from '@interfaces/controller';
import { Request, Router } from 'express';
import { BaseResponse } from '@interfaces/base-response';
import { validateRequest } from '@middlewares/validate.middleware';
import { handleRequest } from '@utils/handle-request';
import { ProductRepository } from '@/repositories/product.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import ProductService from '@/services/product.service';
import {
  getProductByIdSchema,
  getProductSchema,
  patchProductSchema,
  postProductImageSchema,
  postProductSchema,
} from '@/domain/schemas/product.schema';
import { AuthMiddleware, RequestWithUser } from '@middlewares/auth.middleware';
import { GetProductsResponse, PostProductResponse } from '@/domain/dtos/product.dto';
import { Role } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { ReviewRepository } from '@/repositories/review.repository';
import { upload } from '@utils/multer';

class ProductController implements Controller {
  public path = '/products';
  public router = Router();
  private productService: ProductService;
  private authMiddleware: AuthMiddleware;

  constructor() {
    const productRepository = new ProductRepository();
    const categoryRepository = new CategoryRepository();
    const reviewRepository = new ReviewRepository();
    this.productService = new ProductService(productRepository, categoryRepository, reviewRepository);
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoutes();
  }

  postProduct = async (req: RequestWithUser): Promise<BaseResponse<PostProductResponse>> => {
    const createdProduct = await this.productService.create(req.body, req.user.id);
    return { message: 'Product created successfully', data: createdProduct, status: StatusCodes.CREATED };
  };

  patchProduct = async (req: RequestWithUser): Promise<BaseResponse<PostProductResponse>> => {
    const updatedProduct = await this.productService.update(req.body, req.params.id, req.user.id);
    return { message: 'Product updated successfully', data: updatedProduct };
  };

  getAll = async (req: Request): Promise<BaseResponse<GetProductsResponse>> => {
    const products = await this.productService.getAll(req.query);
    return { data: products };
  };

  getOne = async (req: Request) => {
    const product = await this.productService.getOne({ includeCategory: true, includeOwner: true, id: req.params.id });
    return { data: product };
  };

  uploadProductImage = async (req: RequestWithUser) => {
    const data = await this.productService.uploadImage(req.file);
    return { message: 'Image uploaded successfully', data };
  };

  initializeRoutes = () => {
    this.router.post(
      `${this.path}/image/upload`,
      [this.authMiddleware.verify([Role.OWNER]), upload.single('file'), validateRequest(postProductImageSchema)],
      handleRequest(this.uploadProductImage),
    );
    this.router.post(`${this.path}`, [this.authMiddleware.verify([Role.OWNER])], validateRequest(postProductSchema), handleRequest(this.postProduct));
    this.router.get(this.path, validateRequest(getProductSchema), handleRequest(this.getAll));
    this.router.get(`${this.path}/:id`, validateRequest(getProductByIdSchema), handleRequest(this.getOne));
    this.router.patch(
      `${this.path}/:id`,
      [this.authMiddleware.verify([Role.OWNER])],
      validateRequest(patchProductSchema),
      handleRequest(this.patchProduct),
    );
  };
}

export default ProductController;
