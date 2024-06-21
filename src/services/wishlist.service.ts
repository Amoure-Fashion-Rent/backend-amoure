import { GetWishlistOption, WishlistRepository } from '@/repositories/wishlist.repository';
import { ProductRepository } from '@/repositories/product.repository';
import BadRequest from '@errors/bad-request.error';

class WishlistService {
  constructor(
    private wishlistRepository: WishlistRepository,
    private productRepository: ProductRepository,
  ) {}
  async create({ productId }: { productId: number }, userId: number) {
    const product = this.productRepository.getOne({ id: productId });
    if (!product) throw new BadRequest(`Product with id ${productId} not found`);
    return await this.wishlistRepository.create({
      productId,
      userId,
    });
  }

  async getAll(option: GetWishlistOption) {
    return await this.wishlistRepository.getAll(option);
  }
}
export default WishlistService;
