# prefer-inline-action-props

Prefer using inline types instead of interfaces, types or classes.

- **Type**: suggestion
- **Recommended**: Yes
- **Fixable**: No
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

Lots of actions in an NgRx codebase have props, and we need to define the props type of an action when the action is defined. It might seem better to use named interfaces or types while defining those types, but in reality, it will obscure their meaning to the developer using them. Actions props are essentially like function arguments, and the function caller needs to know exactly what type of data to provide (which results in a better IDE experience).

Note: some property names are not allowed to be used, such as `type`

Examples of **incorrect** code for this rule:

```ts
export interface User {
  id: number;
  fullName: string;
}
export const addUser = createAction('[Users] Add User', props<User>());
```

Examples of **correct** code for this rule:

```ts
export const addUser = createAction(
  '[Users] Add User',
  props<{ id: number; fullName: string }>()
);
// or
export const addUser = createAction(
  '[Users] Add User',
  props<{ user: User }>()
);
```
