import { z } from 'zod';
import { RequestSchema } from '@middlewares/validate.middleware';
import { imageSchema, paginationSchema } from '@/domain/schemas/index.schema';

const productStatus = z.enum(['AVAILABLE', 'ON_RENT', 'ON_RETURN']);
const size = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
export const postProductSchema: RequestSchema = {
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    images: z.array(z.string({ required_error: 'Image URL is required' })).min(1),
    description: z.string({ required_error: 'Description is required' }).max(255),
    retailPrice: z.number().positive('Retail price must be a positive number'),
    rentPrice: z.number().positive('Rent price must be a positive number'),
    stylishNotes: z.string({ required_error: 'Stylish notes is required' }).max(255),
    size: size.refine(val => size.options.includes(val), {
      message: "Size must be one of 'XS', 'S', 'M', 'L', 'XL', or 'XXL'",
    }),
    color: z.string({ required_error: 'Color is required' }),
    status: productStatus.refine(val => productStatus.options.includes(val), {
      message: "Status must be one of 'AVAILABLE', 'ON_RENT', or 'ON_RETURN'",
    }),
    categoryId: z.number().positive('Category ID must be a positive number'),
  }),
};

export const postProductImageSchema = {
  file: imageSchema,
};

export const getProductSchema: RequestSchema = {
  query: z.object({
    ...paginationSchema,
    categoryId: z
      .string()
      .transform(id => parseInt(id))
      .optional(),
    includeCategory: z
      .string()
      .transform(val => val == 'true')
      .optional(),
    includeOwner: z
      .string()
      .transform(val => val == 'true')
      .optional(),
    ownerId: z
      .string()
      .transform(id => parseInt(id))
      .optional(),
    search: z.string().optional(),
  }),
};

export const getProductByIdSchema: RequestSchema = {
  params: z.object({
    id: z.string().transform(id => parseInt(id)),
  }),
};

export const patchProductSchema: RequestSchema = {
  body: z.object({
    name: z.string().optional(),
    images: z.array(z.string({ required_error: 'Image URL is required' })).optional(),
    description: z.string().optional(),
    retailPrice: z.number().positive('Retail price must be a positive number').optional(),
    rentPrice: z.number().positive('Rent price must be a positive number').optional(),
    stylishNotes: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    status: productStatus
      .refine(val => productStatus.options.includes(val), {
        message: "Status must be one of 'AVAILABLE', 'ON_RENT', or 'ON_RETURN'",
      })
      .optional(),
    categoryId: z.number().positive('Category ID must be a positive number').optional(),
  }),
  params: z.object({
    id: z.string().transform(id => parseInt(id)),
  }),
};
