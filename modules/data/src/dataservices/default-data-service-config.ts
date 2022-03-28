import { EntityHttpResourceUrls } from './http-url-generator';

/**
 * Optional configuration settings for an entity collection data service
 * such as the `DefaultDataService<T>`.
 */
export abstract class DefaultDataServiceConfig {
  /**
   * root path of the web api.  may also include protocol, domain, and port
   * for remote api, e.g.: `'https://api-domain.com:8000/api/v1'` (default: 'api')
   */
  root?: string;
  /**
   * Known entity HttpResourceUrls.
   * HttpUrlGenerator will create these URLs for entity types not listed here.
   */
  entityHttpResourceUrls?: EntityHttpResourceUrls;
  /** Is a DELETE 404 really OK? (default: true) */
  delete404OK?: boolean;
  /** Simulate GET latency in a demo (default: 0) */
  getDelay?: number;
  /** Simulate save method (PUT/POST/DELETE) latency in a demo (default: 0) */
  saveDelay?: number;
  /** request timeout in MS (default: 0)*/
  timeout?: number; //
  /** to keep trailing slashes or not; false by default */
  trailingSlashEndpoints?: boolean;
}
