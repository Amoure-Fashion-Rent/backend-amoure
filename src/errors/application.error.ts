import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export default class ApplicationError extends Error {
  public status = StatusCodes.INTERNAL_SERVER_ERROR;
  public message: string = ReasonPhrases.INTERNAL_SERVER_ERROR;
  public fieldErrors;
  constructor(message?: string, status?: number, fieldErrors?: any) {
    super();
    if (message != null) {
      this.message = message;
    }
    if (status != null) {
      this.status = status;
    }
    if (fieldErrors) {
      this.fieldErrors = fieldErrors;
    }
  }
}
