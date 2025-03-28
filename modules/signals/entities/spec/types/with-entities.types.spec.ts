import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('withEntities', () => {
  const expectSnippet = expecter(
    (code) => `
      import { signalStore, type } from '@ngrx/signals';
      import { withEntities, entityConfig} from '@ngrx/signals/entities';

      enum UserId {
        One = '1',
        Two = '2',
        Three = '3',
      }

      ${code}
    `,
    compilerOptions()
  );

  it('succeeds when only Entity type is provided as a generic', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities<User>()
      );

      const store = new Store();
      const ids = store.ids();
      const entityMap = store.entityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'EntityId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, EntityId>');
  });

  it('succeeds when both Entity and Id types are provided as generics', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities<User, UserId>()
      );

      const store = new Store();
      const ids = store.ids();
      const entityMap = store.entityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'UserId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, UserId>');
  });

  it('succeeds when Entity type is provided using entityConfig', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities(entityConfig({entity: type<User>()}))
      );

      const store = new Store();
      const ids = store.ids();
      const entityMap = store.entityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'EntityId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, EntityId>');
  });

  it('succeeds when Entity type is provided as both a generic and in entityConfig', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities<User>(entityConfig({entity: type<User>()}))
      );

      const store = new Store();
      const ids = store.ids();
      const entityMap = store.entityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'EntityId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, EntityId>');
  });

  it('succeeds when Entity type is provided as both a generic and in entityConfig, with Id type as a generic', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities<User, UserId>(entityConfig({entity: type<User>()}))
      );

      const store = new Store();
      const ids = store.ids();
      const entityMap = store.entityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'UserId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, UserId>');
  });

  it('succeeds when Entity type is provided with a custom selectId function', () => {
    const snippet = `
      type User = { key: UserId; name: string };

      const Store = signalStore(
        withEntities<User, UserId>(entityConfig({
          entity: type<User>(),
          selectId: (user) => user.key
        }))
      );

      const store = new Store();
      const ids = store.ids();
      const entityMap = store.entityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'UserId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, UserId>');
  });

  it('succeeds when Entity type is provided with a custom collection name', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities(entityConfig({
          entity: type<User>(),
          collection: 'user'
        }))
      );

      const store = new Store();
      const ids = store.userIds();
      const entityMap = store.userEntityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'EntityId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, EntityId>');
  });

  it('succeeds when Entity, Id type, and custom collection name are provided', () => {
    const snippet = `
      type User = { id: UserId; name: string };

      const Store = signalStore(
        withEntities<User, 'user', UserId>(entityConfig({
          entity: type<User>(),
          collection: 'user'
        }))
      );

      const store = new Store();
      const ids = store.userIds();
      const entityMap = store.userEntityMap();
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('ids', 'UserId[]');
    expectSnippet(snippet).toInfer('entityMap', 'EntityMap<User, UserId>');
  });
});
