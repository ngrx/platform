import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { ReflectiveInjector } from '@angular/core';
import { Store, StoreModule, Action, combineReducers } from '../';
import { ReducerManager, INITIAL_STATE } from '../src/private_export';
import { createInjector } from './helpers/injector';
import { counterReducer, INCREMENT, DECREMENT, RESET } from './fixtures/counter';
import { todos, visibilityFilter, VisibilityFilters, SET_VISIBILITY_FILTER, ADD_TODO, COMPLETE_TODO, COMPLETE_ALL_TODOS } from './fixtures/todos';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoAppSchema {
  visibilityFilter: string;
  todos: Todo[];
}

describe('ngRx Integration spec', () => {

  describe('todo integration spec', function() {
    let injector: ReflectiveInjector;
    let store: Store<TodoAppSchema>;
    let currentState: TodoAppSchema;

    const initialState = { todos: [], visibilityFilter: VisibilityFilters.SHOW_ALL };

    injector = createInjector(StoreModule.forRoot({ todos, visibilityFilter }, { initialState }));

    store = injector.get(Store);

    store.subscribe(state => {
      currentState = state;
    });

    it('should successfully instantiate', () => {
      expect(store).toBeDefined();
    });

    it('should combine reducers automatically if a key/value map is provided', () => {
      const reducers = { test: function(){} };
      spyOn(reducers, 'test');
      const action = { type: 'Test Action' };
      const specInjector = createInjector(StoreModule.forRoot(reducers));
      const reducer$: ReducerManager = specInjector.get(ReducerManager);

      reducer$.first().subscribe(reducer => {
        expect(reducer).toBeDefined();
        expect(typeof reducer === 'function').toBe(true);

        reducer(undefined, action);

        expect(reducers.test).toHaveBeenCalledWith(undefined, action);
      });
    });

    it('should use a provided initial state', () => {
      const reducers = { key: (n: number) => n || 2 };
      const initialState = { key: 3 };
      const specInjector = createInjector(StoreModule.forRoot(reducers, { initialState }));

      const resolvedInitialState = specInjector.get(INITIAL_STATE);

      expect(resolvedInitialState).toBe(initialState);
    });

    it('should start with no todos and showing all filter', () => {
      expect(currentState.todos.length).toEqual(0);
      expect(currentState.visibilityFilter).toEqual(VisibilityFilters.SHOW_ALL);
    });

    it('should add a todo', () => {
      store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
      expect(currentState.todos.length).toEqual(1);

      expect(currentState.todos[0].text).toEqual('first todo');
      expect(currentState.todos[0].completed).toEqual(false);
      expect(currentState.todos[0].id).toEqual(1);
    });

    it('should add another todo', () => {
      store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });
      expect(currentState.todos.length).toEqual(2);

      expect(currentState.todos[1].text).toEqual('second todo');
      expect(currentState.todos[1].completed).toEqual(false);
      expect(currentState.todos[1].id).toEqual(2);
    });

    it('should complete the first todo', () => {
      store.dispatch({ type: COMPLETE_TODO, payload: { id: 1 } });
      expect(currentState.todos.length).toEqual(2);

      expect(currentState.todos[0].text).toEqual('first todo');
      expect(currentState.todos[0].completed).toEqual(true);
      expect(currentState.todos[0].id).toEqual(1);
    });

    it('should use visibilityFilter to filter todos', () => {

      const filterVisibleTodos = (visibilityFilter, todos) => {
        let predicate;
        if (visibilityFilter === VisibilityFilters.SHOW_ALL) {
          predicate = () => true;
        }
        else if (visibilityFilter === VisibilityFilters.SHOW_ACTIVE) {
          predicate = (todo) => !todo.completed;
        }
        else {
          predicate = (todo) => todo.completed;
        }
        return todos.filter(predicate);
      };

      let currentlyVisibleTodos;

      Observable.combineLatest(store.select('visibilityFilter'), store.select('todos'), filterVisibleTodos)
        .subscribe(visibleTodos => {
          currentlyVisibleTodos = visibleTodos;
        });

      expect(currentlyVisibleTodos.length).toBe(2);

      store.dispatch({ type: SET_VISIBILITY_FILTER, payload: VisibilityFilters.SHOW_ACTIVE });

      expect(currentlyVisibleTodos.length).toBe(1);
      expect(currentlyVisibleTodos[0].completed).toBe(false);

      store.dispatch({ type: SET_VISIBILITY_FILTER, payload: VisibilityFilters.SHOW_COMPLETED });

      expect(currentlyVisibleTodos.length).toBe(1);
      expect(currentlyVisibleTodos[0].completed).toBe(true);

      store.dispatch({ type: COMPLETE_ALL_TODOS });

      expect(currentlyVisibleTodos.length).toBe(2);
      expect(currentlyVisibleTodos[0].completed).toBe(true);
      expect(currentlyVisibleTodos[1].completed).toBe(true);

      store.dispatch({ type: SET_VISIBILITY_FILTER, payload: VisibilityFilters.SHOW_ACTIVE });

      expect(currentlyVisibleTodos.length).toBe(0);

    });
  });
});
