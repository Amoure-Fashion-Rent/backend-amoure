import ApplicationError from '@errors/application.error';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default class Unauthorized extends ApplicationError {
  constructor(message?: string) {
    super(message || ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
  }
}
