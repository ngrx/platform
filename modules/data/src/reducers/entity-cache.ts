import { EntityCollection } from './entity-collection';

/**
 * @public
 */
export interface EntityCache {
  // Must be `any` since we don't know what type of collections we will have
  [name: string]: EntityCollection<any>;
}
