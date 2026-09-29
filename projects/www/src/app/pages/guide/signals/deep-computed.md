# DeepComputed

The `deepComputed` function creates a `DeepSignal` when a computation result is an object literal.
It can be used as a regular computed signal, but it also contains computed signals for each nested property.

<ngrx-code-example>

```ts
import { signal } from '@angular/core';
import { deepComputed } from '@ngrx/signals';

const limit = signal(25);
const offset = signal(0);
const totalItems = signal(100);

const pagination = deepComputed(() => ({
  currentPage: Math.floor(offset() / limit()) + 1,
  pageSize: limit(),
  totalPages: Math.ceil(totalItems() / limit()),
}));

console.log(pagination()); // logs: { currentPage: 1, pageSize: 25, totalPages: 4 }
console.log(pagination.currentPage()); // logs: 1
console.log(pagination.pageSize()); // logs: 25
console.log(pagination.totalPages()); // logs: 4
```

</ngrx-code-example>

<ngrx-docs-alert type="help">

For enhanced performance, deeply nested signals are generated lazily and initialized only upon first access.

</ngrx-docs-alert>

<ngrx-docs-alert type="help">

When the computation result is a union, `deepComputed` creates a `DeepSignal` for each object literal member. The remaining members (primitives, dynamic records, etc.) stay a regular `Signal`.

```ts
type ValidationResult =
  | { status: 'valid'; value: number }
  | { status: 'invalid'; error: string };

const age = signal<number | null>(null);

// 👇 a DeepSignal is created for each object literal member; null is combined into a Signal
// validationResult: DeepSignal<{ status: 'valid'; value: number }> | DeepSignal<{ status: 'invalid'; error: string }> | Signal<null>
const validationResult = deepComputed((): ValidationResult | null => {
  const value = age();

  if (value === null) {
    return null;
  }

  return value >= 21
    ? { status: 'valid', value }
    : { status: 'invalid', error: 'Must be at least 21' };
});

if ('error' in validationResult) {
  const error = validationResult.error; // Signal<string>
  console.log(error());
}
```

</ngrx-docs-alert>
