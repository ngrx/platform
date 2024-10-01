# DeepComputed

The `deepComputed` function creates a `DeepSignal` when a computation result is an object literal.
It can be used as a regular computed signal, but it also contains computed signals for each nested property.

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

<div class="alert is-helpful">

For enhanced performance, deeply nested signals are generated lazily and initialized only upon first access.

</div>
