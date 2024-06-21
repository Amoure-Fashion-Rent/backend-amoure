import { z } from 'zod';

export const paginationSchema = {
  page: z
    .string()
    .transform(page => parseInt(page))
    .optional(),
  take: z
    .string()
    .transform(take => parseInt(take))
    .optional(),
};

export const imageSchema = z.object({
  buffer: z.instanceof(Buffer),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine(
    mimetype => {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      return validImageTypes.includes(mimetype);
    },
    { message: 'Invalid image type. Only JPEG, PNG, and GIF are allowed.' },
  ),
  size: z.number().max(5 * 1024 * 1024, { message: 'File size should be less than 5MB.' }),
  fieldname: z.string(),
});
