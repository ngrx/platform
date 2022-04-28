# use-effects-lifecycle-interface

Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: Yes
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

If a class is using an effect lifecycle hook, it should implement the corresponding interface.
This prevents signature typos, and it's safer if the signature changes in the future.

Examples of **incorrect** code for this rule:

```ts
class Effect {
  ngrxOnInitEffects(): Action {
    return { type: '[Effect] Init' };
  }
}
```

```ts
class Effect {
  constructor(private actions$: Actions) {}

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    );
  }
}
```

Examples of **correct** code for this rule:

```ts
import { OnInitEffects } from '@ngrx/effects';

class Effect implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[Effect] Init' };
  }
}
```

```ts
import { OnRunEffects } from '@ngrx/effects';

class Effect implements OnRunEffects {
  constructor(private actions$: Actions) {}
  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType('LOGGED_IN'),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    );
  }
}
```

## Further reading

- [Effect lifecycle docs](https://ngrx.io/guide/effects/lifecycle#controlling-effects)
