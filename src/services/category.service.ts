import { CategoryRepository, GetCategoryOption } from '@/repositories/category.repository';

class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}
  async getAll(option: GetCategoryOption) {
    return await this.categoryRepository.getAll(option);
  }
}
export default CategoryService;
