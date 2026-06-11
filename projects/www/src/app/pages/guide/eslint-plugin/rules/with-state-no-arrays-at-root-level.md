# with-state-no-arrays-at-root-level

withState should accept a record or dictionary as an input argument.

- **Type**: problem
- **Fixable**: No
- **Suggestion**: No
- **Requires type checking**: Yes
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule ensures that `withState` does not accept a non-record type at the root level. Arrays, sets, maps, and other non-plain-object types are forbidden as the initial state argument. A factory function is also accepted, in which case its return type is checked instead.

Examples of **correct** code for this rule:

<ngrx-code-example>

```ts
const store = signalStore(withState({ count: 0 }));

const store = signalStore(withState({ items: [] }));

const initialState = { count: 0 };
const store = signalStore(withState(initialState));

// Factory function - return type is checked
const store = signalStore(withState(() => ({ count: 0 })));

// Factory function with dependency injection
const INITIAL_STATE = new InjectionToken('InitialState', {
  factory: () => ({ count: 0 }),
});
const store = signalStore(withState(() => inject(INITIAL_STATE)));
```

</ngrx-code-example>

Examples of **incorrect** code for this rule:

<ngrx-code-example>

```ts
const store = signalStore(withState([1, 2, 3]));

const store = signalStore(withState(new Set()));

const store = signalStore(withState(new Map()));

const initialState: number[] = [];
const store = signalStore(withState(initialState));

// Factory function returning a forbidden type
const store = signalStore(withState(() => [1, 2, 3]));
```

</ngrx-code-example>
