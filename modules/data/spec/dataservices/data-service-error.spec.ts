import { HttpErrorResponse } from '@angular/common/http';
import { DataServiceError } from '../../';

describe('DataServiceError', () => {
  describe('#message', () => {
    it('should define message when ctor error is string', () => {
      const expected = 'The error';
      const dse = new DataServiceError(expected, null);
      expect(dse.message).toBe(expected);
    });

    it('should define message when ctor error is new Error("message")', () => {
      const expected = 'The error';
      const dse = new DataServiceError(new Error(expected), null);
      expect(dse.message).toBe(expected);
    });

    it('should define message when ctor error is typical HttpResponseError', () => {
      const expected = 'The error';
      const body = expected; // server error is typically in the body of the server response
      const httpErr = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        url: 'http://foo.com/bad',
        error: body,
      });
      const dse = new DataServiceError(httpErr, null);
      expect(dse.message).toBe(expected);
    });
  });
});
