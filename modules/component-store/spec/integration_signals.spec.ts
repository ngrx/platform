import { ComponentStore } from '@ngrx/component-store';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  visibilityFilter: string;
  todos: Todo[];
}

describe('NgRx ComponentStore and Signals Integration spec', () => {
  let store: ComponentStore<TodoState>;

  const initialState = {
    todos: [],
    visibilityFilter: VisibilityFilters.SHOW_ALL,
  };

  beforeEach(() => {
    store = new ComponentStore<TodoState>(initialState);
  });

  describe('todo integration spec', function () {
    describe('using the store.selectSignal', () => {
      it('should use visibilityFilter to filter todos', () => {
        store.setState((state) => {
          return {
            ...state,
            todos: [
              { id: 1, text: 'first todo', completed: false },
              { id: 2, text: 'second todo', completed: false },
            ],
          };
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

        const filter = () => store.state().visibilityFilter;
        const todos = store.selectSignal((state) => state.todos);
        const currentlyVisibleTodos = () =>
          filterVisibleTodos(filter(), todos());

        expect(currentlyVisibleTodos().length).toBe(2);

        store.setState((state) => {
          const todos = state.todos.map((todo) => {
            if (todo.id === 1) {
              return { ...todo, completed: true };
            }

            return todo;
          });

          return {
            ...state,
            visibilityFilter: VisibilityFilters.SHOW_ACTIVE,
            todos,
          };
        });

        expect(currentlyVisibleTodos().length).toBe(1);
        expect(currentlyVisibleTodos()[0].completed).toBe(false);

        store.setState((state) => ({
          ...state,
          visibilityFilter: VisibilityFilters.SHOW_COMPLETED,
        }));

        expect(currentlyVisibleTodos().length).toBe(1);
        expect(currentlyVisibleTodos()[0].completed).toBe(true);

        store.setState((state) => {
          const todos = state.todos.map((todo) => {
            return { ...todo, completed: true };
          });

          return {
            ...state,
            todos,
          };
        });

        expect(currentlyVisibleTodos().length).toBe(2);
        expect(currentlyVisibleTodos()[0].completed).toBe(true);
        expect(currentlyVisibleTodos()[1].completed).toBe(true);

        store.setState((state) => ({
          ...state,
          visibilityFilter: VisibilityFilters.SHOW_ACTIVE,
        }));

        expect(currentlyVisibleTodos().length).toBe(0);
      });
    });
  });

  describe('context integration spec', () => {
    it('ComponentStore.selectSignal should not throw an error if used outside in the injection context', () => {
      let error;

      try {
        store.selectSignal((state) => state.todos);
      } catch (e) {
        error = `${e}`;
      }

      expect(error).toBeUndefined();
    });
  });
});
