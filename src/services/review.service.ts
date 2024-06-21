import BadRequest from '@errors/bad-request.error';
import { GetReviewOption, IInsertReview, ReviewRepository } from '@/repositories/review.repository';
import NotFound from '@errors/not-found.error';
import Forbidden from '@errors/forbidden.error';
import { ProductRepository } from '@/repositories/product.repository';

class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private productRepository: ProductRepository,
  ) {}

  async getOne(id: number) {
    const review = await this.reviewRepository.getOne({ id });
    if (!review) throw new NotFound();
    return review;
  }
  async create(data: Omit<IInsertReview, 'userId'>, userId: number) {
    const product = this.productRepository.getOne({ id: data.productId });
    if (!product) throw new BadRequest(`Product with id ${data.productId} not found`);
    const review = await this.reviewRepository.getOne({ productId: data.productId, userId: userId });
    if (!!review) throw new BadRequest('You already made a review for the product');
    return await this.reviewRepository.create({ ...data, userId });
  }

  async getAll(option: GetReviewOption) {
    return await this.reviewRepository.getAll(option);
  }

  async delete(id: number, userId: number) {
    const review = await this.getOne(id);
    if (review.userId !== userId) throw new Forbidden();
    await this.reviewRepository.delete(id);
  }
}
export default ReviewService;
