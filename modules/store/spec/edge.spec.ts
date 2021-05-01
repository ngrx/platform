import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';

import { todoCount, todos } from './fixtures/edge_todos';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Todo {}

interface TodoAppSchema {
  todoCount: number;
  todos: Todo[];
}

describe('ngRx Store', () => {
  describe('basic store actions', () => {
    let store: Store<TodoAppSchema>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot<TodoAppSchema>({ todos, todoCount } as any),
        ],
      });

      store = TestBed.inject(Store);
    });

    it('should provide an Observable Store', () => {
      expect(store).toBeDefined();
    });

    it('should handle re-entrancy', (done: any) => {
      let todosNextCount = 0;
      let todosCountNextCount = 0;

      store.pipe(select('todos')).subscribe((todos) => {
        todosNextCount++;
        store.dispatch({ type: 'SET_COUNT', payload: todos.length });
      });

      store.pipe(select('todoCount')).subscribe((count) => {
        todosCountNextCount++;
      });

      store.dispatch({ type: 'ADD_TODO', payload: { name: 'test' } });
      expect(todosNextCount).toBe(2);
      expect(todosCountNextCount).toBe(2);

      setTimeout(() => {
        expect(todosNextCount).toBe(2);
        expect(todosCountNextCount).toBe(2);
        done();
      }, 10);
    });
  });
});
