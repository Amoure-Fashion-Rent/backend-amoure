import { z } from 'zod';
import { RequestSchema } from '@middlewares/validate.middleware';
import { Role } from '@prisma/client';

export const registerSchema: RequestSchema = {
  body: z.object({
    email: z.string({ required_error: 'Email cannot be empty' }).email({ message: 'Invalid email format' }),
    password: z.string({ required_error: 'Password cannot be empty' }).min(6, { message: 'Password must be at least 6 characters' }),
    fullName: z
      .string({ required_error: 'First name cannot be empty' })
      .min(2, { message: 'First name should be longer than 2 characters' })
      .max(255, { message: 'Name is too long' }),
    role: z.enum([Role.OWNER, Role.USER]),
  }),
};
