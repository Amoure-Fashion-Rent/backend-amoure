import { GetProductOption, ProductRepository } from '@/repositories/product.repository';
import { PostProductRequest, PatchProductRequest } from '@/domain/dtos/product.dto';
import { CategoryRepository } from '@/repositories/category.repository';
import BadRequest from '@errors/bad-request.error';
import NotFound from '@errors/not-found.error';
import Forbidden from '@errors/forbidden.error';
import { ReviewRepository } from '@/repositories/review.repository';
import { bucket } from '@utils/storage';
import { PRODUCT_BUCKET_NAME } from '@/lib/config';
import ApplicationError from '@errors/application.error';

class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private categoryRepository: CategoryRepository,
    private reviewRepository: ReviewRepository,
  ) {}

  getAll = async (option: GetProductOption) => {
    const { count, products } = await this.productRepository.getAll(option);
    const productIds = products.map(product => product.id);
    const reviewsData = await this.reviewRepository.getAverageRatingAndCount(productIds);
    const reviewsMap = reviewsData.reduce((acc, { productId, ...review }) => {
      acc[productId] = review;
      return acc;
    }, {});
    return {
      count,
      products: products.map(product => {
        const review = reviewsMap[product.id.toString()];
        return {
          ...product,
          avgRating: review?.avgRating || null,
          reviewsCount: review?.count || 0,
        };
      }),
    };
  };

  getOne = async (option: GetProductOption) => {
    const product = await this.productRepository.getOne(option);
    if (!product) {
      throw new NotFound();
    }
    const similarProducts = await this.getAll({ ids: product.similarItems, take: 10 });

    return { ...product, similarProducts };
  };

  create = async (payload: PostProductRequest, ownerId: number) => {
    // check category
    const category = await this.categoryRepository.getOne({ id: payload.categoryId });
    if (!category) {
      throw new BadRequest(`Category with id ${payload.categoryId} doesn't exist`);
    }

    return await this.productRepository.create({
      ...payload,
      ownerId,
    });
  };

  update = async (payload: PatchProductRequest, productId: number, userId: number) => {
    // check product
    const product = await this.getOne({ id: productId });
    if (product.ownerId !== userId) {
      throw new Forbidden();
    }
    return await this.productRepository.update(productId, payload);
  };

  uploadImage = async file => {
    try {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      await new Promise((resolve, reject) => {
        blobStream.on('finish', resolve);
        blobStream.on('error', reject);
        blobStream.end(file.buffer);
      });

      return { imageUrl: `https://storage.googleapis.com/${PRODUCT_BUCKET_NAME}/${blob.name}` };
    } catch (e) {
      throw new ApplicationError(e.message);
    }
  };
}

export default ProductService;
