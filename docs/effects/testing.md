# Testing

## @ngrx/effects/testing

### provideMockActions

Provides a mock test provider of the `Actions` Observable for testing effects. This works well with writing
marble tests and tests using the `subscribe` method on an Observable. The mock Actions will deliver a new Observable to subscribe to for each test.

Details on marble tests and their syntax, as shown in the `hot` and `cold` methods, can be found in [Writing Marble Tests](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md).

Usage:

```ts
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { MyEffects } from './my-effects';
import * as MyActions from '../actions/my-actions';

describe('My Effects', () => {
  let effects: MyEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // any modules needed
      ],
      providers: [
        MyEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    effects = TestBed.get(MyEffects);
  });

  it('should work', () => {
    const action = new MyActions.ExampleAction();
    const completion = new MyActions.ExampleActionSuccess();

    // Refer to 'Writing Marble Tests' for details on '--a-' syntax
    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: completion });

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

### getEffectsMetadata

Returns decorator configuration for all effects in a class instance.
Use this function to ensure that effects have been properly decorated.

Usage:

```ts
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { MyEffects } from './my-effects';

describe('My Effects', () => {
  let effects: MyEffects;
  let metadata: EffectsMetadata<MyEffects>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyEffects,
        // other providers
      ],
    });

    effects = TestBed.get(MyEffects);
    metadata = getEffectsMetadata(effects);
  });

  it('should register someSource$ that dispatches an action', () => {
    expect(metadata.someSource$).toEqual({ dispatch: true });
  });

  it('should register someOtherSource$ that does not dispatch an action', () => {
    expect(metadata.someOtherSource$).toEqual({ dispatch: false });
  });

  it('should not register undecoratedSource$', () => {
    expect(metadata.undecoratedSource$).toBeUndefined();
  });
});
```
