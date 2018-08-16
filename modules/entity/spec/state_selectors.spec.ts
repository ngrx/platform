import { createEntityAdapter, EntityAdapter, EntityState } from '../src';
import { EntitySelectors } from '../src/models';
import {
  BookModel,
  AClockworkOrange,
  AnimalFarm,
  TheGreatGatsby,
} from './fixtures/book';

describe('Entity State Selectors', () => {
  describe('Composed Selectors', () => {
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

    it('should create a selector for selecting an entity by id', () => {
      const entity = selectors.selectById('tgg')(state);

      expect(entity).toEqual(TheGreatGatsby);
    });
  });

  describe('Uncomposed Selectors', () => {
    type State = EntityState<BookModel>;

    let adapter: EntityAdapter<BookModel>;
    let selectors: EntitySelectors<BookModel, EntityState<BookModel>>;
    let state: State;

    beforeEach(() => {
      adapter = createEntityAdapter({
        selectId: (book: BookModel) => book.id,
      });

      state = adapter.addAll(
        [AClockworkOrange, AnimalFarm, TheGreatGatsby],
        adapter.getInitialState()
      );

      selectors = adapter.getSelectors();
    });

    it('should create a selector for selecting the ids', () => {
      const ids = selectors.selectIds(state);

      expect(ids).toEqual(state.ids);
    });

    it('should create a selector for selecting the entities', () => {
      const entities = selectors.selectEntities(state);

      expect(entities).toEqual(state.entities);
    });

    it('should create a selector for selecting the list of models', () => {
      const models = selectors.selectAll(state);

      expect(models).toEqual([AClockworkOrange, AnimalFarm, TheGreatGatsby]);
    });

    it('should create a selector for selecting the count of models', () => {
      const total = selectors.selectTotal(state);

      expect(total).toEqual(3);
    });

    it('should create a selector for selecting an entity by id', () => {
      const entity = selectors.selectById('tgg')(state);

      expect(entity).toEqual(TheGreatGatsby);
    });
  });
});
