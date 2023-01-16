import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { HttpParamsOptions } from '@angular/common/http';

/** A service that performs REST-like HTTP data operations for an entity collection */
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

export type HttpMethods = 'DELETE' | 'GET' | 'POST' | 'PUT';

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
 */
export interface HttpOptions {
  httpParams?: HttpParamsOptions;
  httpHeaders?: string | { [p: string]: string | string[] };
  [key: string]: any;
}
