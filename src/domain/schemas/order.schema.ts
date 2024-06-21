import { RequestSchema } from '@middlewares/validate.middleware';
import { z } from 'zod';
import { paginationSchema } from '@/domain/schemas/index.schema';
import BadRequest from '@errors/bad-request.error';

export const postOrderSchema: RequestSchema = {
  body: z.object({
    productId: z.number({ required_error: 'Product ID is required' }).positive(),
    rentalStartDate: z.preprocess(
      arg => {
        if (typeof arg === 'string' || arg instanceof Date) {
          return new Date(arg);
        }
        throw new BadRequest('Invalid rental start date');
      },
      z.date({ required_error: 'Rental Start Date is required' }),
    ),
    rentalEndDate: z.preprocess(
      arg => {
        if (typeof arg === 'string' || arg instanceof Date) {
          return new Date(arg);
        }
        throw new BadRequest('Invalid rental end date');
      },
      z.date({ required_error: 'Rental End Date is required' }),
    ),
  }),
};

export const getOrdersSchema: RequestSchema = {
  query: z.object({
    ...paginationSchema,
    includeProduct: z
      .string()
      .transform(val => val == 'true')
      .optional(),
  }),
};
