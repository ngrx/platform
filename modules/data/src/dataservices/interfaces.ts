import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';

/**
 * A service that performs REST-like HTTP data operations for an entity collection
 * @public
 */
export interface EntityCollectionDataService<T> {
  readonly name: string;
  add(entity: T, httpOptions?: HttpOptions): Observable<T>;
  delete(
    id: number | string,
    httpOptions?: HttpOptions
  ): Observable<number | string>;
  getAll(httpOptions?: HttpOptions): Observable<T[]>;
  getById(id: any, httpOptions?: HttpOptions): Observable<T>;
  getWithQuery(
    params: QueryParams | string,
    httpOptions?: HttpOptions
  ): Observable<T[]>;
  update(update: Update<T>, httpOptions?: HttpOptions): Observable<T>;
  upsert(entity: T, httpOptions?: HttpOptions): Observable<T>;
}

/**
 * @public
 */
export type HttpMethods = 'DELETE' | 'GET' | 'POST' | 'PUT';

/**
 * @public
 */
export interface RequestData {
  method: HttpMethods;
  url: string;
  data?: any;
  options?: any;
}

/**
 * A key/value map of parameters to be turned into an HTTP query string
 * Same as HttpClient's HttpParamsOptions which at the time of writing was
 * NOT exported at package level
 * https://github.com/angular/angular/issues/22013
 *
 * @deprecated Use HttpOptions instead. getWithQuery still accepts QueryParams as its
 * first argument, but HttpOptions.httpParams uses Angular's own HttpParamsOptions which
 * HttpClient accepts as an argument.
 * @public
 */
export interface QueryParams {
  [name: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
}

/**
 * Options that adhere to the constructor arguments for HttpParams and
 * HttpHeaders.
 * @public
 */
export interface HttpOptions {
  httpParams?: HttpParams;
  httpHeaders?: HttpHeaders;
}

/**
 * Type that adheres to angular's Http Headers
 * @public
 */
export type HttpHeaders = string | { [p: string]: string | string[] };

/**
 * Options that partially adheres to angular's HttpParamsOptions. The non-serializable encoder property is omitted.
 * @public
 */
export declare interface HttpParams {
  /**
   * String representation of the HTTP parameters in URL-query-string format.
   * Mutually exclusive with `fromObject`.
   */
  fromString?: string;
  /** Object map of the HTTP parameters. Mutually exclusive with `fromString`. */
  fromObject?: {
    [param: string]:
      | string
      | number
      | boolean
      | ReadonlyArray<string | number | boolean>;
  };
}
