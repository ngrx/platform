# Testing

### provideMockActions

Provides a mock test provider of the `Actions` Observable for testing effects. This works well with writing
marble tests and tests using the `subscribe` method on an Observable. The mock Actions will deliver a new Observable to subscribe to for each test.

Details on marble tests and their syntax, as shown in the `hot` and `cold` methods, can be found in [Writing Marble Tests](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md).

Usage:

<code-example header="my.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { MyEffects } from './my-effects';
import * as MyActions from '../actions/my-actions';

describe('My Effects', () => {
  let effects: MyEffects;
  let actions: Observable&lt;any&gt;;

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
</code-example>

### getEffectsMetadata

Returns decorator configuration for all effects in a class instance.
Use this function to ensure that effects have been properly decorated.

Usage:

<code-example header="my.effects.spec.ts">
import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { MyEffects } from './my-effects';

describe('My Effects', () => {
  let effects: MyEffects;
  let metadata: EffectsMetadata&lt;MyEffects&gt;;

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
</code-example>

### Effects as functions

Effects can be defined as functions as well as variables. Defining an effect as a function allows you to define default values while having the option to override these variables during tests. This without breaking the functionality in the application.

The following example effect debounces the user input into from a search action.

<code-example header="my.effects.spec.ts">
@Effect()
search$ = this.actions$.pipe(
  ofType(BookActionTypes.Search),
  debounceTime(300, asyncScheduler),
  switchMap(...)
)
</code-example>

The same effect but now defined as a function, would look as follows:

<code-example header="my.effects.spec.ts">
@Effect()
// refactor as input properties and provide default values
search$ = ({
  debounce = 300,
  scheduler = asyncScheduler
} = {}) => this.actions$.pipe(
  ofType(BookActionTypes.Search),
  debounceTime(debounce, scheduler),
  switchMap(...)
)
</code-example>

Within our tests we can now override the default properties:

<code-example header="my.effects.spec.ts">
const actual = effects.search$({
  debounce: 30,
  scheduler: getTestScheduler(),
});
expect(actual).toBeObservable(expected);
</code-example>

Doing this has the extra benefit of hiding implementation details, making your tests less prone to break due to implementation details changes. Meaning that if you would change the `debounceTime` inside the effect your tests wouldn't have to be changed,these tests would still pass.
