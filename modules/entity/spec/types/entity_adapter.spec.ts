import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('EntityAdapter Types', () => {
  const expectSnippet = expecter(
    (code) => `
        import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

        interface EntityWithStringId {
          id: string;
        }

        interface EntityWithNumberId {
          id: number;
        }

        interface EntityWithoutId {
          key: number;
        }


        ${code}
      `,
    compilerOptions()
  );

  it('sets the id type to string when the entity has a string id', () => {
    expectSnippet(`
        export const adapter: EntityAdapter<EntityWithStringId, string> = createEntityAdapter<EntityWithStringId>();
      `).toSucceed();
  });

  it('sets the id type to number when the entity has a number id', () => {
    expectSnippet(`
        export const adapter: EntityAdapter<EntityWithNumberId, number> = createEntityAdapter<EntityWithNumberId>();
      `).toSucceed();
  });

  it('sets the id type to string when selectId returns a string', () => {
    expectSnippet(`
        export const adapter: EntityAdapter<EntityWithNumberId, string> = createEntityAdapter<EntityWithNumberId>({
          selectId: (entity) => entity.id.toString(),
        });
      `).toSucceed();
  });

  it('sets the id type to string | number when the entity has no id and no selectId is provided', () => {
    expectSnippet(`
        export const adapter: EntityAdapter<EntityWithoutId, string | number> = createEntityAdapter<EntityWithoutId>();
      `).toSucceed();
  });

  it('sets the id type to correct type if selectId is provided', () => {
    expectSnippet(`
        export const adapter: EntityAdapter<EntityWithoutId, string> = createEntityAdapter<EntityWithoutId>({
          selectId: (entity) => entity.key.toString(),
        });
      `).toSucceed();
  });

  it('sets the id type to string when selectId returns a string', () => {
    expectSnippet(`
        export const adapter: EntityAdapter<EntityWithNumberId, string> = createEntityAdapter<EntityWithNumberId>({
          selectId: (entity) => entity.id.toString(),
        });
      `).toSucceed();
  });
}, 8_000);
