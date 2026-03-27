import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  type EntityId,
  withEntities,
} from '@ngrx/signals/entities';
import { describe, it } from 'tstyche';

describe('withEntities', () => {
  it('succeeds when creating a custom feature with named collection', () => {
    function withAddEntities<
      Entity extends { id: EntityId },
      Collection extends string,
    >(collection: Collection) {
      const config = entityConfig({
        entity: type<Entity>(),
        collection,
      });

      return signalStoreFeature(
        withEntities(config),
        withMethods((store) => ({
          addEntity(entity: Entity): void {
            patchState(store, addEntity(entity, { collection }));
          },
        }))
      );
    }
  });
});
