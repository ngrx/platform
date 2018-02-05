import { Observable } from 'rxjs/Observable';
import { todos, todoCount } from './fixtures/edge_todos';
import { createInjector } from './helpers/injector';
import { Store, StoreModule, select } from '../';

interface TestAppSchema {
  counter1: number;
  counter2: number;
  counter3: number;
}

interface Todo {}

interface TodoAppSchema {
  todoCount: number;
  todos: Todo[];
}

describe('ngRx Store', () => {
  describe('basic store actions', () => {
    let store: Store<TodoAppSchema>;

    beforeEach(() => {
      const injector = createInjector(
        StoreModule.forRoot<TodoAppSchema>({ todos, todoCount } as any)
      );

      store = injector.get(Store);
    });

    it('should provide an Observable Store', () => {
      expect(store).toBeDefined();
    });

    it('should handle re-entrancy', (done: any) => {
      let todosNextCount = 0;
      let todosCountNextCount = 0;

      store.pipe(select('todos')).subscribe((todos: any[]) => {
        todosNextCount++;
        store.dispatch({ type: 'SET_COUNT', payload: todos.length });
      });

      store.pipe(select('todoCount')).subscribe(count => {
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
