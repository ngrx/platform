import { TestBed } from '@angular/core/testing';
import { ActionReducerMap, Store, provideStore } from '..';

import { State } from '../src/private_export';
import {
  ADD_TODO,
  COMPLETE_ALL_TODOS,
  COMPLETE_TODO,
  SET_VISIBILITY_FILTER,
  todos,
  visibilityFilter,
  VisibilityFilters,
  resetId,
} from './fixtures/todos';
import { computed } from '@angular/core';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoAppSchema {
  visibilityFilter: string;
  todos: Todo[];
}

describe('NgRx and Signals Integration spec', () => {
  let store: Store<TodoAppSchema>;
  let state: State<TodoAppSchema>;

  const initialState = {
    todos: [],
    visibilityFilter: VisibilityFilters.SHOW_ALL,
  };
  const reducers: ActionReducerMap<TodoAppSchema, any> = {
    todos: todos,
    visibilityFilter: visibilityFilter,
  };

  beforeEach(() => {
    resetId();
    spyOn(reducers, 'todos').and.callThrough();

    TestBed.configureTestingModule({
      providers: [provideStore(reducers, { initialState })],
    });

    store = TestBed.inject(Store);
    state = TestBed.inject(State);
  });

  describe('todo integration spec', function () {
    describe('using the store.selectSignal', () => {
      it('should use visibilityFilter to filter todos', () => {
        store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
        store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });
        store.dispatch({
          type: COMPLETE_TODO,
          payload: { id: state.value.todos[0].id },
        });

        const filterVisibleTodos = (
          visibilityFilter: string,
          todos: Todo[]
        ) => {
          let predicate;
          if (visibilityFilter === VisibilityFilters.SHOW_ALL) {
            predicate = () => true;
          } else if (visibilityFilter === VisibilityFilters.SHOW_ACTIVE) {
            predicate = (todo: any) => !todo.completed;
          } else {
            predicate = (todo: any) => todo.completed;
          }
          return todos.filter(predicate);
        };

        const filter = TestBed.runInInjectionContext(() =>
          store.selectSignal((state) => state.visibilityFilter)
        );
        const todos = TestBed.runInInjectionContext(() =>
          store.selectSignal((state) => state.todos)
        );
        const currentlyVisibleTodos = () =>
          filterVisibleTodos(filter(), todos());

        expect(currentlyVisibleTodos().length).toBe(2);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_ACTIVE,
        });

        expect(currentlyVisibleTodos().length).toBe(1);
        expect(currentlyVisibleTodos()[0].completed).toBe(false);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_COMPLETED,
        });

        expect(currentlyVisibleTodos().length).toBe(1);
        expect(currentlyVisibleTodos()[0].completed).toBe(true);

        store.dispatch({ type: COMPLETE_ALL_TODOS });

        expect(currentlyVisibleTodos().length).toBe(2);
        expect(currentlyVisibleTodos()[0].completed).toBe(true);
        expect(currentlyVisibleTodos()[1].completed).toBe(true);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_ACTIVE,
        });

        expect(currentlyVisibleTodos().length).toBe(0);
      });
    });
  });

  describe('context integration spec', () => {
    it('Store.selectSignal should not throw an error if used outside in the injection context', () => {
      let error;

      try {
        store.selectSignal((state) => state.todos);
      } catch (e) {
        error = `${e}`;
      }

      expect(error).toBeUndefined();
    });
  });

  describe('immutable state integration spec', () => {
    it('Store.selectSignal should not trigger on unrelated global state changes', () => {
      let todosTriggerCount = 0;

      const todos = store.selectSignal((state) => state.todos);

      const todosTriggerState = computed(() => {
        todos();
        return ++todosTriggerCount;
      });

      store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
      expect(todosTriggerState()).toBe(1);

      store.dispatch({
        type: SET_VISIBILITY_FILTER,
        payload: VisibilityFilters.SHOW_ACTIVE,
      });
      expect(todosTriggerState()).toBe(1);
    });
  });
});
