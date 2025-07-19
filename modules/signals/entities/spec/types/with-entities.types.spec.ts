import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('withEntities', () => {
  const expectSnippet = expecter(
    (code) => `
        import {
          patchState,
          signalStoreFeature,
          type,
          withMethods,
        } from '@ngrx/signals';
        import {
          addEntity,
          entityConfig,
          EntityId,
          withEntities,
        } from '@ngrx/signals/entities';

        ${code}
      `,
    compilerOptions()
  );

  it('succeeds when creating a custom feature with named collection', () => {
    const snippet = `
      function withAddEntities<
        Entity extends { id: EntityId },
        Collection extends string
      >(
        collection: Collection
      ) {
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
    `;

    expectSnippet(snippet).toSucceed();
  });
});
