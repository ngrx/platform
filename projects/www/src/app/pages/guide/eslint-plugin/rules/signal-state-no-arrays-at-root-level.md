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

This rule ensure that a Signal State shouldn't accept an array type at the root level.

Examples of **correct** code for this rule:

<ngrx-code-example>

```ts
const store = withState({ foo: 'bar' });

const store = withState({ arrayAsProperty: ['foo', 'bar'] });

const initialState = {};
const store = signalStore(withState(initialState));
```

</ngrx-code-example>

Examples of **incorrect** code for this rule:

<ngrx-code-example>

```ts
const store = withState([1, 2, 3]);

const store = withState([{ foo: 'bar' }]);

const store = withState<string[]>([]);

const initialState = [];
const store = withState(initialState);
```

</ngrx-code-example>
