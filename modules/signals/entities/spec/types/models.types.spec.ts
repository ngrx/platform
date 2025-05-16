import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('models', () => {
  const expectSnippet = expecter(
    (code) => `
        import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
        import { addEntity, entityConfig, withEntities } from '@ngrx/signals/entities';
        type User = { id: number; name: string };

        ${code}
      `,
    compilerOptions()
  );

  it('succeeds when entity collection name is passed as the type parameter', () => {
    const snippet = `
    const storeFactory = <Collection extends string>(
      collection: Collection
    ) => {
      const Store = signalStore(
        withEntities({ entity: type<User>(), collection: collection }),
        withMethods((store) => ({
          addUsers(user: User): void {
            patchState(store, addEntity(user, { collection: collection }));
          },
        }))
      );

      return new Store();
    };
`;

    expectSnippet(snippet).toSucceed();
  });
});
