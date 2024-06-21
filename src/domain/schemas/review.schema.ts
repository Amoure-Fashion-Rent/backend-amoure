import { RequestSchema } from '@middlewares/validate.middleware';
import { z } from 'zod';
import { paginationSchema } from '@/domain/schemas/index.schema';

export const postReviewSchema: RequestSchema = {
  body: z.object({
    rating: z.number().int().lte(5).gte(1),
    comment: z.string().max(255),
    productId: z.number().positive(),
  }),
};

export const deleteReviewSchema: RequestSchema = {
  params: z.object({
    id: z.string().transform(id => parseInt(id)),
  }),
};

export const getReviewSchema: RequestSchema = {
  query: z.object({
    ...paginationSchema,
    productId: z
      .string()
      .transform(id => parseInt(id))
      .optional(),
    includeUser: z
      .string()
      .transform(val => val == 'true')
      .optional(),
  }),
};
