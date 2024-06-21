import { RequestSchema } from '@middlewares/validate.middleware';
import { z } from 'zod';

export const refreshTokenSchema: RequestSchema = {
  body: z.object({
    refreshToken: z.string({ required_error: `Refresh token can't be empty` }),
  }),
};
