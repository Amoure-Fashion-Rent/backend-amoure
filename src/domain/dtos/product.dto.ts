import { IInsertProduct, IUpdateProduct } from '@/repositories/product.repository';
import { Product } from '@prisma/client';
export interface PostProductRequest extends IInsertProduct {}
export interface PatchProductRequest extends IUpdateProduct {}
export interface PostProductResponse extends Product {}

export interface GetProductsResponse {
  products: Product[];
  count: number;
}
