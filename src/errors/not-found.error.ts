import ApplicationError from '@errors/application.error';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default class NotFound extends ApplicationError {
  constructor(message?: string) {
    super(message || ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
  }
}
