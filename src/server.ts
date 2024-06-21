import Application from '@/application';
import AuthController from '@controllers/auth.controller';
import TokenController from '@controllers/token.controller';
import ProductController from '@controllers/product.controller';
import CategoryController from '@controllers/category.controller';
import WishlistController from '@controllers/wishlist.controller';
import ReviewController from '@controllers/review.controller';
import MLController from './controllers/ml.controller';
import OrderController from './controllers/order.controller';

const app = new Application([
  new AuthController(),
  new TokenController(),
  new ProductController(),
  new CategoryController(),
  new WishlistController(),
  new ReviewController(),
  new MLController(),
  new OrderController(),
]);
app.listen();
// const port = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
