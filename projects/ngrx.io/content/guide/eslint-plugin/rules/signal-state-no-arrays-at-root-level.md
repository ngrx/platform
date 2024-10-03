# signal-state-no-arrays-at-root-level

signalState should accept a record or dictionary as an input argument.

- **Type**: problem
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule ensure that a Signal State shouldn't accept an array type at root level.

Examples of **correct** code for this rule:

```ts
const store = withState({ foo: 'bar' })
```
```ts
const initialState = {};
const store = signalStore(withState(initialState));
```

Examples of **incorrect** code for this rule:

```ts
const store = withState([1, 2, 3]);
```
```ts
const store = withState([{ foo: 'bar' }]);
```
```ts
const store = withState<string[]>([]);
```
```ts
const initialState = [];
const store = withState(initialState);
```
