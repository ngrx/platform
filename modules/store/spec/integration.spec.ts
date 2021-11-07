import { TestBed } from '@angular/core/testing';
import {
  ActionReducer,
  ActionReducerMap,
  select,
  Store,
  StoreModule,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { first, toArray, take, map } from 'rxjs/operators';

import { INITIAL_STATE, ReducerManager, State } from '../src/private_export';
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
import { RouterTestingModule } from '@angular/router/testing';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

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
  describe('todo integration spec', function () {
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
        imports: [StoreModule.forRoot(reducers, { initialState })],
      });

      store = TestBed.inject(Store);
      state = TestBed.inject(State);
    });

    it('should successfully instantiate', () => {
      expect(store).toBeDefined();
    });

    it('should combine reducers automatically if a key/value map is provided', (done) => {
      const action = { type: 'Test Action' };
      const reducer$ = TestBed.inject(ReducerManager);

      reducer$.pipe(first()).subscribe((reducer: ActionReducer<any, any>) => {
        expect(reducer).toBeDefined();
        expect(typeof reducer === 'function').toBe(true);

        reducer({ todos: [] }, action);

        expect(reducers.todos).toHaveBeenCalledWith([], action);
        done();
      });
    });

    it('should use a provided initial state', () => {
      const resolvedInitialState = TestBed.inject(INITIAL_STATE);

      expect(resolvedInitialState).toEqual(initialState);
    });

    it('should start with no todos and showing all filter', () => {
      expect(state.value.todos.length).toEqual(0);
      expect(state.value.visibilityFilter).toEqual(VisibilityFilters.SHOW_ALL);
    });

    it('should add a todo', () => {
      store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });

      expect(state.value.todos.length).toEqual(1);
      expect(state.value.todos[0].text).toEqual('first todo');
      expect(state.value.todos[0].completed).toEqual(false);
    });

    it('should add another todo', () => {
      store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
      store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });

      expect(state.value.todos.length).toEqual(2);
      expect(state.value.todos[1].text).toEqual('second todo');
      expect(state.value.todos[1].completed).toEqual(false);
    });

    it('should complete the first todo', () => {
      store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
      store.dispatch({
        type: COMPLETE_TODO,
        payload: { id: state.value.todos[0].id },
      });

      expect(state.value.todos[0].completed).toEqual(true);
    });

    describe('using the store.select', () => {
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

        let currentlyVisibleTodos: Todo[] = [];

        combineLatest([store.select('visibilityFilter'), store.select('todos')])
          .pipe(map(([filter, todos]) => filterVisibleTodos(filter, todos)))
          .subscribe((visibleTodos) => {
            currentlyVisibleTodos = visibleTodos;
          });

        expect(currentlyVisibleTodos.length).toBe(2);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_ACTIVE,
        });

        expect(currentlyVisibleTodos.length).toBe(1);
        expect(currentlyVisibleTodos[0].completed).toBe(false);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_COMPLETED,
        });

        expect(currentlyVisibleTodos.length).toBe(1);
        expect(currentlyVisibleTodos[0].completed).toBe(true);

        store.dispatch({ type: COMPLETE_ALL_TODOS });

        expect(currentlyVisibleTodos.length).toBe(2);
        expect(currentlyVisibleTodos[0].completed).toBe(true);
        expect(currentlyVisibleTodos[1].completed).toBe(true);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_ACTIVE,
        });

        expect(currentlyVisibleTodos.length).toBe(0);
      });

      it('should use props to get a todo', (done: any) => {
        const getTodosById = createSelector(
          (state: TodoAppSchema) => state.todos,
          (todos: Todo[], id: number) => {
            return todos.find((p) => p.id === id);
          }
        );

        const todo$ = store.select(getTodosById, 2);
        todo$.pipe(take(3), toArray()).subscribe((res) => {
          expect(res).toEqual([
            undefined,
            {
              id: 2,
              text: 'second todo',
              completed: false,
            },
            {
              id: 2,
              text: 'second todo',
              completed: true,
            },
          ]);
          done();
        });

        store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
        store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });
        store.dispatch({
          type: COMPLETE_TODO,
          payload: { id: 2 },
        });
      });

      it('should use the selector and props to get a todo', (done: any) => {
        const getTodosState = createFeatureSelector<TodoAppSchema, Todo[]>(
          'todos'
        );
        const getTodos = createSelector(getTodosState, (todos) => todos);
        const getTodosById = createSelector(
          getTodos,
          (state: TodoAppSchema, id: number) => id,
          (todos, id) => todos.find((todo) => todo.id === id)
        );

        const todo$ = store.select(getTodosById, 2);
        todo$.pipe(take(3), toArray()).subscribe((res) => {
          expect(res).toEqual([
            undefined,
            { id: 2, text: 'second todo', completed: false },
            { id: 2, text: 'second todo', completed: true },
          ]);
          done();
        });

        store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
        store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });
        store.dispatch({
          type: COMPLETE_TODO,
          payload: { id: 2 },
        });
      });
    });

    describe('using the select operator', () => {
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

        let currentlyVisibleTodos: Todo[] = [];

        combineLatest([
          store.pipe(select('visibilityFilter')),
          store.pipe(select('todos')),
        ])
          .pipe(map(([filter, todos]) => filterVisibleTodos(filter, todos)))
          .subscribe((visibleTodos) => {
            currentlyVisibleTodos = visibleTodos;
          });

        expect(currentlyVisibleTodos.length).toBe(2);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_ACTIVE,
        });

        expect(currentlyVisibleTodos.length).toBe(1);
        expect(currentlyVisibleTodos[0].completed).toBe(false);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_COMPLETED,
        });

        expect(currentlyVisibleTodos.length).toBe(1);
        expect(currentlyVisibleTodos[0].completed).toBe(true);

        store.dispatch({ type: COMPLETE_ALL_TODOS });

        expect(currentlyVisibleTodos.length).toBe(2);
        expect(currentlyVisibleTodos[0].completed).toBe(true);
        expect(currentlyVisibleTodos[1].completed).toBe(true);

        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          payload: VisibilityFilters.SHOW_ACTIVE,
        });

        expect(currentlyVisibleTodos.length).toBe(0);
      });

      it('should use the selector and props to get a todo', (done: any) => {
        const getTodosState = createFeatureSelector<TodoAppSchema, Todo[]>(
          'todos'
        );
        const getTodos = createSelector(getTodosState, (todos) => todos);
        const getTodosById = createSelector(
          getTodos,
          (state: TodoAppSchema, id: number) => id,
          (todos, id) => todos.find((todo) => todo.id === id)
        );

        const todo$ = store.pipe(select(getTodosById, 2));
        todo$.pipe(take(3), toArray()).subscribe((res) => {
          expect(res).toEqual([
            undefined,
            { id: 2, text: 'second todo', completed: false },
            { id: 2, text: 'second todo', completed: true },
          ]);
          done();
        });

        store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
        store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });
        store.dispatch({
          type: COMPLETE_TODO,
          payload: { id: 2 },
        });
      });

      it('should use the props in the projector to get a todo', (done: any) => {
        const getTodosState = createFeatureSelector<TodoAppSchema, Todo[]>(
          'todos'
        );

        const getTodosById = createSelector(
          getTodosState,
          (todos: Todo[], { id }: { id: number }) =>
            todos.find((todo) => todo.id === id)
        );

        const todo$ = store.pipe(select(getTodosById, { id: 2 }));
        todo$.pipe(take(3), toArray()).subscribe((res) => {
          expect(res).toEqual([
            undefined,
            {
              id: 2,
              text: 'second todo',
              completed: false,
            },
            {
              id: 2,
              text: 'second todo',
              completed: true,
            },
          ]);
          done();
        });

        store.dispatch({ type: ADD_TODO, payload: { text: 'first todo' } });
        store.dispatch({ type: ADD_TODO, payload: { text: 'second todo' } });
        store.dispatch({
          type: COMPLETE_TODO,
          payload: { id: 2 },
        });
      });
    });
  });

  describe('feature state', () => {
    it('should initialize properly', () => {
      const initialState = {
        todos: [
          {
            id: 1,
            text: 'do things',
            completed: false,
          },
        ],
        visibilityFilter: VisibilityFilters.SHOW_ALL,
      };

      const reducers: ActionReducerMap<TodoAppSchema, any> = {
        todos: todos,
        visibilityFilter: visibilityFilter,
      };

      const featureInitialState = [{ id: 1, completed: false, text: 'Item' }];

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot(reducers, { initialState }),
          StoreModule.forFeature('items', todos, {
            initialState: featureInitialState,
          }),
        ],
      });

      const store = TestBed.inject(Store);

      const expected = [
        {
          todos: initialState.todos,
          visibilityFilter: initialState.visibilityFilter,
          items: featureInitialState,
        },
      ];

      store.pipe(select((state) => state)).subscribe((state) => {
        expect(state).toEqual(expected.shift());
      });
    });

    it('should initialize properly with a partial state', () => {
      const initialState = {
        items: [{ id: 1, completed: false, text: 'Item' }],
      };

      const reducers: ActionReducerMap<TodoAppSchema, any> = {
        todos: todos,
        visibilityFilter: visibilityFilter,
      };

      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({} as any, {
            initialState,
          }),
          StoreModule.forFeature('todos', reducers),
          StoreModule.forFeature('items', todos),
        ],
      });

      const store = TestBed.inject(Store);

      const expected = {
        todos: {
          todos: [],
          visibilityFilter: VisibilityFilters.SHOW_ALL,
        },
        items: [{ id: 1, completed: false, text: 'Item' }],
      };

      store.pipe(select((state) => state)).subscribe((state) => {
        expect(state).toEqual(expected);
      });
    });

    it('throws if forRoot() is used more than once', (done: any) => {
      @NgModule({
        imports: [StoreModule.forRoot({})],
      })
      class FeatureModule {}

      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot({}), RouterTestingModule.withRoutes([])],
      });

      const router = TestBed.inject(Router);

      router.resetConfig([
        {
          path: 'feature-path',
          loadChildren: () => Promise.resolve(FeatureModule),
        },
      ]);

      router.navigateByUrl('/feature-path').catch((err: TypeError) => {
        expect(err.message).toBe(
          'StoreModule.forRoot() called twice. Feature modules should use StoreModule.forFeature() instead.'
        );
        done();
      });
    });
  });
});
