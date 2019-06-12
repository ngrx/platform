import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';

/** A service that performs REST-like HTTP data operations for an entity collection */
export interface EntityCollectionDataService<T> {
  readonly name: string;
  add(entity: T, options?: EntityDataServiceOptions): Observable<T>;
  delete(
    id: number | string,
    options?: EntityDataServiceOptions
  ): Observable<number | string>;
  getAll(options?: EntityDataServiceOptions): Observable<T[]>;
  getById(id: any, options?: EntityDataServiceOptions): Observable<T>;
  getWithQuery(
    params: QueryParams | string,
    options?: EntityDataServiceOptions
  ): Observable<T[]>;
  update(update: Update<T>, options?: EntityDataServiceOptions): Observable<T>;
  upsert(entity: T, options?: EntityDataServiceOptions): Observable<T>;
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
 * Same as HttpClient's HttpParamsOptions which is NOT exported at package level
 * https://github.com/angular/angular/issues/22013
 */
export interface QueryParams {
  [name: string]: string | string[];
}

/**
 * The EntityDataServiceOptions interface contains a tag property
 * which is from the EntityActionOptions.tag
 */
export interface EntityDataServiceOptions {
  tag?: string;
}
