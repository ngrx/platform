import { Injectable } from '@angular/core';
/**
 * Default options for EntityDispatcher behavior
 * such as whether `add()` is optimistic or pessimistic by default.
 * An optimistic save modifies the collection immediately and before saving to the server.
 * A pessimistic save modifies the collection after the server confirms the save was successful.
 * This class initializes the defaults to the safest values.
 * Provide an alternative to change the defaults for all entity collections.
 */
@Injectable()
export class EntityDispatcherDefaultOptions {
  /** True if added entities are saved optimistically; false if saved pessimistically. */
  optimisticAdd = false;
  /** True if deleted entities are saved optimistically; false if saved pessimistically. */
  optimisticDelete = true;
  /** True if updated entities are saved optimistically; false if saved pessimistically. */
  optimisticUpdate = false;
  /** True if upsert entities are saved optimistically; false if saved pessimistically. */
  optimisticUpsert = false;
  /** True if entities in a cache saveEntities request are saved optimistically; false if saved pessimistically. */
  optimisticSaveEntities = false;
}
