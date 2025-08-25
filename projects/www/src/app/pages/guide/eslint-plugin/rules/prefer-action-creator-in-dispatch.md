# prefer-action-creator-in-dispatch

Using `action creator` in `dispatch` is preferred over `object` or old `Action`.

- **Type**: suggestion
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Examples of **incorrect** code for this rule:

<ngrx-code-example>

```ts
store$.dispatch(new CustomAction());

this.store$.dispatch(new AuthActions.Login({ type }));

this.store$.dispatch({ type: 'custom' });
```

</ngrx-code-example>

Examples of **correct** code for this rule:

<ngrx-code-example>

```ts
store$.dispatch(action);

this.store$.dispatch(BookActions.load());

this.store$.dispatch(AuthActions.Login({ payload }));
```

</ngrx-code-example>
