import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import '../src/add/operator/select';

const state = {
  todos: {
    a: {
      title: 'First Todo'
    },
    b: {
      title: 'Second Todo'
    }
  },
  filter: 'all'
};

describe('select Operator', function() {
  it('should accept a string and return that property from the object', function(done) {
    Observable.of(state)
      .select('filter')
      .subscribe({
        next(val) {
          expect(val).toBe(state.filter);
        },
        error: done,
        complete: done
      });
  });

  it('should return a list of strings and deeply map into the object', function(done) {
    Observable.of(state)
      .select('todos', 'a', 'title')
      .subscribe({
        next(val) {
          expect(val).toBe(state.todos.a.title);
        },
        error: done,
        complete: done
      });
  });

  it('should accept a map function instead of a string', function(done) {
    Observable.of(state)
      .select(s => s.todos.b.title)
      .subscribe({
        next(val) {
          expect(val).toBe(state.todos.b.title);
        },
        error: done,
        complete: done
      });
  });

  it('should not emit a new value if there is no change', function(done) {
    let callCount = 0;
    Observable.of(state, state, state)
      .select('todos')
      .subscribe({
        next() {
          ++callCount;
        },
        error: done,
        complete() {
          expect(callCount).toEqual(1);
          done();
        }
      });
  });
});
