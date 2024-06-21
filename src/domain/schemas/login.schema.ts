import { z } from 'zod';
import { RequestSchema } from '@middlewares/validate.middleware';
import BadRequest from '@errors/bad-request.error';

export const loginSchema: RequestSchema = {
  body: z.object({
    email: z.string({ required_error: 'Email cannot be empty' }),
    password: z.string({ required_error: 'Password cannot be empty' }),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    fullName: z.string().optional(),
    addressDetail: z.string().optional(),
    province: z.string().optional(),
    district: z.string().optional(),
    postalCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    birthDate: z
      .preprocess(
        arg => {
          if (typeof arg === 'string' || arg instanceof Date) {
            return new Date(arg);
          }
          throw new BadRequest('Invalid birthDate');
        },
        z.date({ required_error: 'birthDate is required' }),
      )
      .optional(),
  }),
};
