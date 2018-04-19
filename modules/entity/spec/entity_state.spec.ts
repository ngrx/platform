import { createEntityAdapter, EntityAdapter, EntityState } from '../src';
import { BookModel } from './fixtures/book';

describe('Entity State', () => {
  let adapter: EntityAdapter<BookModel>;

  beforeEach(() => {
    adapter = createEntityAdapter({
      selectId: (book: BookModel) => book.id,
    });
  });

  it('should let you get the initial state', () => {
    const initialState = adapter.getInitialState();

    expect(initialState).toEqual({
      ids: [],
      entities: {},
    });
  });

  it('should let you provide additional initial state properties', () => {
    const additionalProperties = { isHydrated: true };

    // initialState is type EntityState<BookModel> & { isHydrated: boolean; }
    const initialState = adapter.getInitialState(additionalProperties);

    expect(initialState).toEqual({
      ...additionalProperties,
      ids: [],
      entities: {},
    });
  });

  it('should provide intellisense for additional initial state properties', () => {
    interface StateWithAdditionalProps extends EntityState<BookModel> {
      isHydrated: boolean;
    }

    // initialState is type StateWithAdditionalProps
    const initialState = adapter.getInitialState<StateWithAdditionalProps>({
        // intellisense here for StateWithAdditionalProps
        isHydrated: true,
        // nonStateProp: 'not allowed', // red squigglies
    });

    expect(initialState).toEqual({
      isHydrated: true,
      ids: [],
      entities: {},
    });
  });
});
