import { RequestSchema } from '@middlewares/validate.middleware';
import { z } from 'zod';
import { paginationSchema } from '@/domain/schemas/index.schema';

export const postWishlistSchema: RequestSchema = {
  body: z.object({
    productId: z.number().positive('Category ID must be a positive number'),
  }),
};

export const getWishlistSchema: RequestSchema = {
  query: z.object({
    ...paginationSchema,
    includeProducts: z
      .string()
      .transform(val => val == 'true')
      .optional(),
  }),
};
