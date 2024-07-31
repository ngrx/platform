# prefer-action-creator

Using `action creator` is preferred over `Action class`.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Examples of **incorrect** code for this rule:

```ts
class Test implements Action {
  type = '[Customer Page] Load Customer';
}

class Test implements ngrx.Action {
  readonly type = ActionTypes.success;

  constructor(readonly payload: Payload) {}
}
```

Examples of **correct** code for this rule:

```ts
export const loadUser = createAction('[User Page] Load User');

class Test {
  type = '[Customer Page] Load Customer';
}

class Test implements Action {
  member = '[Customer Page] Load Customer';
}
```
