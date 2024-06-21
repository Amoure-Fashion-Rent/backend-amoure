import { AnyZodObject } from 'zod';
import { NextFunction, Request } from 'express';
import BadRequest from '@errors/bad-request.error';

export interface RequestSchema {
  params?: AnyZodObject;
  body?: AnyZodObject;
  query?: AnyZodObject;
  user?: AnyZodObject;
  file?: AnyZodObject;
}

export const validate = (schema: AnyZodObject, data: any) => {
  const result = schema.safeParse({ ...data });
  if (!result.success) {
    // @ts-ignore
    throw new BadRequest('Validation Error', result.error.flatten());
  }
  return result.data;
};

export const validateRequest = ({ params, body, query, file }: RequestSchema) => {
  // @ts-ignore
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (params) {
        req.params = validate(params, req.params);
      }
      if (body) {
        req.body = validate(body, req.body);
      }
      if (query) {
        req.query = validate(query, req.query);
      }
      if (file) {
        req.file = validate(file, req.file);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
