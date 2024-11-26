import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('entityConfig', () => {
  const expectSnippet = expecter(
    (code) => `
        import { type } from '@ngrx/signals';
        import { entityConfig, SelectEntityId } from '@ngrx/signals/entities';

        type User = { key: number; name: string };

        ${code}
      `,
    compilerOptions()
  );

  it('fails when empty object is passed', () => {
    expectSnippet('entityConfig({})').toFail(
      /Property 'entity' is missing in type '{}'/
    );
  });

  it('succeeds when entity is passed', () => {
    const snippet = `
      const userConfig = entityConfig({ entity: type<User>() });
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer('userConfig', '{ entity: User; }');
  });

  it('succeeds when entity and collection are passed', () => {
    const snippet = `
      const userConfig = entityConfig({
        entity: type<User>(),
        collection: 'user',
      });
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'userConfig',
      '{ entity: User; collection: "user"; }'
    );
  });

  it('succeeds when entity and selectId are passed', () => {
    const snippet = `
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
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'userConfig1',
      '{ entity: User; selectId: SelectEntityId<NoInfer<User>>; }'
    );
    expectSnippet(snippet).toInfer(
      'userConfig2',
      '{ entity: User; selectId: SelectEntityId<NoInfer<User>>; }'
    );
    expectSnippet(snippet).toInfer(
      'userConfig3',
      '{ entity: User; selectId: SelectEntityId<NoInfer<User>>; }'
    );
  });

  it('fails when entity and wrong selectId are passed', () => {
    expectSnippet(`
      const userConfig = entityConfig({
        entity: type<User>(),
        selectId: (user) => user.id,
      });
    `).toFail(/Property 'id' does not exist on type 'User'/);

    expectSnippet(`
      const selectId = (entity: { key: number; foo: string }) => entity.key;

      const userConfig = entityConfig({
        entity: type<User>(),
        selectId,
      });
    `).toFail(/No overload matches this call/);

    expectSnippet(`
      const selectId: SelectEntityId<{ key: string }> = (entity) => entity.key;

      const userConfig = entityConfig({
        entity: type<User>(),
        selectId,
      });
    `).toFail(/No overload matches this call/);
  });

  it('succeeds when entity, collection, and selectId are passed', () => {
    const snippet = `
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
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'userConfig1',
      '{ entity: User; collection: "user"; selectId: SelectEntityId<NoInfer<User>>; }'
    );
    expectSnippet(snippet).toInfer(
      'userConfig2',
      '{ entity: User; collection: "user"; selectId: SelectEntityId<NoInfer<User>>; }'
    );
    expectSnippet(snippet).toInfer(
      'userConfig3',
      '{ entity: User; collection: "user"; selectId: SelectEntityId<NoInfer<User>>; }'
    );
  });

  it('fails when entity, collection, and wrong selectId are passed', () => {
    expectSnippet(`
      const userConfig = entityConfig({
        entity: type<User>(),
        collection: 'user',
        selectId: (user) => user.id,
      });
    `).toFail(/Property 'id' does not exist on type 'User'/);

    expectSnippet(`
      const selectId = (entity: { key: number; foo: string }) => entity.key;

      const userConfig = entityConfig({
        entity: type<User>(),
        collection: 'user',
        selectId,
      });
    `).toFail(/No overload matches this call/);

    expectSnippet(`
      const selectId: SelectEntityId<{ key: string }> = (entity) => entity.key;

      const userConfig = entityConfig({
        entity: type<User>(),
        collection: 'user',
        selectId,
      });
    `).toFail(/No overload matches this call/);
  });
});
