import Controller from '@interfaces/controller';
import { handleRequest } from '@utils/handle-request';
import { Request, Router } from 'express';
import MLService from '@/services/ml.service';
import { MLRepository } from '@/repositories/ml.repository';
import { upload } from '@utils/multer';
import { validateRequest } from '@/middlewares/validate.middleware';
import { postMLImageSchema } from '@/domain/schemas/ml.schema';
import { RequestWithUser } from '@/middlewares/auth.middleware';
import ProductService from '@/services/product.service';
import { ProductRepository } from '@/repositories/product.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { CategoryRepository } from '@/repositories/category.repository';

class MLController implements Controller {
  public path = '/ml';
  public router = Router();
  private mlService: MLService;
  constructor() {
    const mlRepository = new MLRepository();
    const productRepository = new ProductRepository();
    const reviewRepository = new ReviewRepository();
    const categoryRepository = new CategoryRepository();
    const productService = new ProductService(productRepository, categoryRepository, reviewRepository);
    this.mlService = new MLService(mlRepository, productService);
    this.initializeRoutes();
  }

  getNgrok = async (req: Request) => {
    const url = await this.mlService.getNgrok(req.query);
    return { data: url };
  };

  updateNgrok = async (req: Request) => {
    const response = await this.mlService.updateNgrok(req.body);
    return { data: response };
  };

  uploadProductImage = async (req: RequestWithUser) => {
    const data = await this.mlService.uploadImage(req.file);
    return { message: 'Image uploaded successfully', data };
  };

  vton = async (req: Request) => {
    const response = await this.mlService.vton(req.query);
    return { data: response };
  };

  searchByImage = async (req: Request) => {
    const data = await this.mlService.searchByImage(req.query);
    return { data };
  };

  searchByQuery = async (req: Request) => {
    const data = await this.mlService.searchByQuery(req.query);
    return { data };
  };

  initializeRoutes = () => {
    this.router.get(`${this.path}/ngrok`, handleRequest(this.getNgrok));
    this.router.post(`${this.path}/ngrok`, handleRequest(this.updateNgrok));
    this.router.post(`${this.path}/image/upload`, upload.single('file'), validateRequest(postMLImageSchema), handleRequest(this.uploadProductImage));
    this.router.get(`${this.path}/vton`, handleRequest(this.vton));
    this.router.get(`${this.path}/image/search`, handleRequest(this.searchByImage));
    this.router.get(`${this.path}/search`, handleRequest(this.searchByQuery));
  };
}

export default MLController;
