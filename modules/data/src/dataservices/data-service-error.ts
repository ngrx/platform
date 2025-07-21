import { EntityAction } from '../actions/entity-action';
import { RequestData } from './interfaces';

/**
 * Error from a DataService
 * The source error either comes from a failed HTTP response or was thrown within the service.
 * @param error - the HttpErrorResponse or the error thrown by the service
 * @param requestData - the HTTP request information such as the method and the url.
 * @public
 */
export class DataServiceError extends Error {
  constructor(public error: any, public requestData: RequestData | null) {
    super(
      typeof error === 'string' ? error : extractMessage(error) ?? undefined
    );
    this.name = this.constructor.name;
  }
}

// Many ways the error can be shaped. These are the ways we recognize.
function extractMessage(sourceError: any): string | null {
  const { error, body, message } = sourceError;
  let errMessage: string | null = null;
  if (error) {
    // prefer HttpErrorResponse.error to its message property
    errMessage = typeof error === 'string' ? error : error.message;
  } else if (message) {
    errMessage = message;
  } else if (body) {
    // try the body if no error or message property
    errMessage = typeof body === 'string' ? body : body.error;
  }

  return typeof errMessage === 'string'
    ? errMessage
    : errMessage
    ? JSON.stringify(errMessage)
    : null;
}

/**
 * Payload for an EntityAction data service error such as QUERY_ALL_ERROR
 * @public
 */
export interface EntityActionDataServiceError {
  error: DataServiceError;
  originalAction: EntityAction;
}
