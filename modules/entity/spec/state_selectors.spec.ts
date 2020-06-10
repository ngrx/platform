import { createEntityAdapter, EntityAdapter, EntityState } from '../src';
import { EntitySelectors } from '../src/models';
import {
  BookModel,
  AClockworkOrange,
  AnimalFarm,
  TheGreatGatsby,
} from './fixtures/book';
import { MemoizedSelector, createSelector } from '@ngrx/store';

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
        books: adapter.setAll(
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

  describe('Uncomposed Selectors', () => {
    type State = EntityState<BookModel>;

    let adapter: EntityAdapter<BookModel>;
    let selectors: EntitySelectors<BookModel, EntityState<BookModel>>;
    let state: State;

    beforeEach(() => {
      adapter = createEntityAdapter({
        selectId: (book: BookModel) => book.id,
      });

      state = adapter.setAll(
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

    it('should type single entity from Dictionary as entity type or undefined', () => {
      // MemoizedSelector acts like a type checker
      const singleEntity: MemoizedSelector<
        EntityState<BookModel>,
        BookModel | undefined
      > = createSelector(selectors.selectEntities, (enitites) => enitites[0]);
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
});
