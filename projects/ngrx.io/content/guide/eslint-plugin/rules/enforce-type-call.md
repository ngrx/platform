# enforce-type-call

The `type` function from `@ngrx/signals` must be called.

- **Type**: problem
- **Fixable**: Yes
- **Suggestion**: Yes
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

This rule ensures that the `type` function from `@ngrx/signals` is properly called when used to define types. The function must be invoked with parentheses `()` after the generic type parameter.

Examples of **incorrect** code for this rule:

```ts
import { type } from '@ngrx/signals';
const stateType = type<{ count: number }>;
```

```ts
import { type as typeFn } from '@ngrx/signals';
const stateType = typeFn<{ count: number }>;
```

Examples of **correct** code for this rule:

```ts
import { type } from '@ngrx/signals';
const stateType = type<{ count: number }>();
```

```ts
import { type as typeFn } from '@ngrx/signals';
const stateType = typeFn<{ count: number; name: string }>();
```

## Further reading

- [Signal Store Documentation](guide/signals/signal-store)
