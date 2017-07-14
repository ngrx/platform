# Testing

## @ngrx/effects/testing

### provideMockActions
Provides a mock test provider of the `Actions` Observable for testing effects. This works well with writing
marble tests and tests using the `subscribe` method on an Observable. The mock Actions will deliver a new Observable
to subscribe to for each test.

Usage:
```ts
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { hot, cold } from 'jasmine-marbles';
import { MyEffects } from './my-effects';

describe('My Effects', () => {
  let effects: MyEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    effects = TestBed.get(MyEffects);
  });

  it('should work', () => {
    actions = hot('--a-', { a: SomeAction });

    const expected = cold('--b', { b: AnotherAction });

    expect(effects.someSource$).toBeObservable(expected);
  });

  it('should work also', () => {
    actions = new ReplaySubject(1);

    actions.next(SomeAction);

    effects.someSource$.subscribe(result => {
      expect(result).toEqual(AnotherAction);
    });
  });  
});
```