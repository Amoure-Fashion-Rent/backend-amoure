import Controller from '@interfaces/controller';
import CategoryService from '@/services/category.service';
import { CategoryRepository } from '@/repositories/category.repository';
import { validateRequest } from '@middlewares/validate.middleware';
import { handleRequest } from '@utils/handle-request';
import { Request, Router } from 'express';
import { getCategorySchema } from '@/domain/schemas/category.schema';

class CategoryController implements Controller {
  public path = '/categories';
  public router = Router();
  private categoryService: CategoryService;
  constructor() {
    const categoryRepository = new CategoryRepository();
    this.categoryService = new CategoryService(categoryRepository);
    this.initializeRoutes();
  }

  getAll = async (req: Request) => {
    const products = await this.categoryService.getAll(req.query);
    return { data: products };
  };

  initializeRoutes = () => {
    this.router.get(this.path, validateRequest(getCategorySchema), handleRequest(this.getAll));
  };
}

export default CategoryController;
