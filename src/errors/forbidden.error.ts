import ApplicationError from '@errors/application.error';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default class Forbidden extends ApplicationError {
  constructor(message?: string) {
    super(message || ReasonPhrases.FORBIDDEN, StatusCodes.FORBIDDEN);
  }
}
