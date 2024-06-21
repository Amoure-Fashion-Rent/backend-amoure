import { NextFunction, Request, Response } from 'express';
import ApplicationError from '@errors/application.error';
import { BaseResponse } from '@interfaces/base-response';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const handleRequest = (handler: (req: Request) => Promise<BaseResponse<any>>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, message, data } = await handler(req);
      res.status(status || StatusCodes.OK).send({ message: message || ReasonPhrases.OK, data });
      next();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        return next(err);
      }
      next(new ApplicationError());
    }
  };
};
