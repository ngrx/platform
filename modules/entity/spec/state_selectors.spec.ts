import { createEntityAdapter, EntityAdapter, EntityState } from '../src';
import { EntitySelectors } from '../src/models';
import {
  BookModel,
  AClockworkOrange,
  AnimalFarm,
  TheGreatGatsby,
} from './fixtures/book';

describe('Entity State', () => {
  interface State {
    books: EntityState<BookModel>;
  }

  let adapter: EntityAdapter<BookModel>;
  let selectors: EntitySelectors<BookModel, State>;
  let state: State;

  beforeEach(() => {
    adapter = createEntityAdapter({
      selectId: (book: BookModel) => book.id,
    });

    state = {
      books: adapter.addAll(
        [AClockworkOrange, AnimalFarm, TheGreatGatsby],
        adapter.getInitialState()
      ),
    };

    selectors = adapter.getSelectors((state: State) => state.books);
  });

  it('should create a selector for selecting the ids', () => {
    const ids = selectors.selectIds(state);

    expect(ids).toEqual(state.books.ids);
  });

  it('should create a selector for selecting the entities', () => {
    const entities = selectors.selectEntities(state);

    expect(entities).toEqual(state.books.entities);
  });

  it('should create a selector for selecting the list of models', () => {
    const models = selectors.selectAll(state);

    expect(models).toEqual([AClockworkOrange, AnimalFarm, TheGreatGatsby]);
  });

  it('should create a selector for selecting the count of models', () => {
    const total = selectors.selectTotal(state);

    expect(total).toEqual(3);
  });
});
