import ApplicationError from '@errors/application.error';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default class BadRequest extends ApplicationError {
  constructor(message?: string, fieldErrors?: any) {
    super(message || ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST, fieldErrors);
  }
}
