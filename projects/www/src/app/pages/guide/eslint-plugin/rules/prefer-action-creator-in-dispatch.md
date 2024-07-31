# prefer-action-creator-in-dispatch

Using `action creator` in `dispatch` is preferred over `object` or old `Action`.

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
store$.dispatch(new CustomAction());

this.store$.dispatch(new AuthActions.Login({ type }));

this.store$.dispatch({ type: 'custom' });
```

Examples of **correct** code for this rule:

```ts
store$.dispatch(action);

this.store$.dispatch(BookActions.load());

this.store$.dispatch(AuthActions.Login({ payload }));
```
