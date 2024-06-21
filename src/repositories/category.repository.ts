import prisma from '@/lib/database/prisma';

export interface GetCategoryOption {
  id?: number;
  includeProducts?: boolean;
}
export class CategoryRepository {
  async getAll(option: GetCategoryOption) {
    return await prisma.category.findMany({
      include: {
        products: !!option.includeProducts,
      },
    });
  }

  async getOne(option: GetCategoryOption) {
    return await prisma.category.findFirst({
      where: {
        id: option.id,
      },
    });
  }
}
