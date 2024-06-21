import { RequestSchema } from '@middlewares/validate.middleware';
import { z } from 'zod';

export const getCategorySchema: RequestSchema = {
  query: z.object({
    includeProducts: z
      .string()
      .transform(val => val == 'true')
      .optional(),
  }),
};
