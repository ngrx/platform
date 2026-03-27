import { type } from '@ngrx/signals';
import { entityConfig, type SelectEntityId } from '@ngrx/signals/entities';
import { describe, expect, it } from 'tstyche';

type User = { key: number; name: string };

describe('entityConfig', () => {
  it('fails when empty object is passed', () => {
    expect(entityConfig).type.not.toBeCallableWith({});
  });

  it('succeeds when entity is passed', () => {
    const userConfig = entityConfig({ entity: type<User>() });

    expect(userConfig).type.toBe<{ entity: User }>();
  });

  it('succeeds when entity and collection are passed', () => {
    const userConfig = entityConfig({
      entity: type<User>(),
      collection: 'user',
    });

    expect(userConfig).type.toBe<{ entity: User; collection: 'user' }>();
  });

  it('succeeds when entity and selectId are passed', () => {
    const userConfig1 = entityConfig({
      entity: type<User>(),
      selectId: (user) => user.key,
    });

    const selectId2 = (user: User) => user.key;
    const userConfig2 = entityConfig({
      entity: type<User>(),
      selectId: selectId2,
    });

    const selectId3: SelectEntityId<User> = (user) => user.key;
    const userConfig3 = entityConfig({
      entity: type<User>(),
      selectId: selectId3,
    });

    expect(userConfig1).type.toBe<{
      entity: User;
      selectId: SelectEntityId<NoInfer<User>>;
    }>();
    expect(userConfig2).type.toBe<{
      entity: User;
      selectId: SelectEntityId<NoInfer<User>>;
    }>();
    expect(userConfig3).type.toBe<{
      entity: User;
      selectId: SelectEntityId<NoInfer<User>>;
    }>();
  });

  it('fails when entity and wrong selectId are passed', () => {
    entityConfig({
      entity: type<User>(),
      // @ts-expect-error Property 'id' does not exist on type 'User'
      selectId: (user) => user.id,
    });

    const selectId1 = (entity: { key: number; foo: string }) => entity.key;
    entityConfig({
      entity: type<User>(),
      // @ts-expect-error No overload matches this call
      selectId1,
    });

    const selectId2: SelectEntityId<{ key: string }> = (entity) => entity.key;
    entityConfig({
      entity: type<User>(),
      // @ts-expect-error No overload matches this call
      selectId2,
    });
  });

  it('succeeds when entity, collection, and selectId are passed', () => {
    const userConfig1 = entityConfig({
      entity: type<User>(),
      collection: 'user',
      selectId: (user) => user.key,
    });

    const selectId2 = (user: { key: number }) => user.key;
    const userConfig2 = entityConfig({
      entity: type<User>(),
      collection: 'user',
      selectId: selectId2,
    });

    const selectId3: SelectEntityId<User> = (user) => user.key;
    const userConfig3 = entityConfig({
      entity: type<User>(),
      collection: 'user',
      selectId: selectId3,
    });

    expect(userConfig1).type.toBe<{
      entity: User;
      collection: 'user';
      selectId: SelectEntityId<NoInfer<User>>;
    }>();
    expect(userConfig2).type.toBe<{
      entity: User;
      collection: 'user';
      selectId: SelectEntityId<NoInfer<User>>;
    }>();
    expect(userConfig3).type.toBe<{
      entity: User;
      collection: 'user';
      selectId: SelectEntityId<NoInfer<User>>;
    }>();
  });

  it('fails when entity, collection, and wrong selectId are passed', () => {
    entityConfig({
      entity: type<User>(),
      collection: 'user',
      // @ts-expect-error Property 'id' does not exist on type 'User'
      selectId: (user) => user.id,
    });

    const selectId1 = (entity: { key: number; foo: string }) => entity.key;
    entityConfig({
      entity: type<User>(),
      // @ts-expect-error No overload matches this call
      collection: 'user',
      selectId1,
    });

    const selectId2: SelectEntityId<{ key: string }> = (entity) => entity.key;
    entityConfig({
      entity: type<User>(),
      // @ts-expect-error No overload matches this call
      collection: 'user',
      selectId2,
    });
  });
});
