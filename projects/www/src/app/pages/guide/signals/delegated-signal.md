# DelegatedSignal

The `delegatedSignal` function creates a `WritableSignal` whose reads are delegated to a `source` computation and whose writes are delegated to an `update` callback.
It is useful for bridging two state containers.

<ngrx-code-example>

```ts
import { Component, inject } from '@angular/core';
import {
  form,
  FormField,
  minLength,
  required,
} from '@angular/forms/signals';
import {
  delegatedSignal,
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';

type User = { id: number; name: string };

const UsersStore = signalStore(
  { providedIn: 'root' },
  withState({ query: '', limit: 10, users: [] as User[] }),
  withMethods((store) => ({
    updateFilter(query: string, limit: number): void {
      patchState(store, { query, limit });
    },
  }))
);

@Component({
  selector: 'app-user-list',
  imports: [FormField],
  template: `
    <input type="text" [formField]="filterForm.query" />
    <input type="number" [formField]="filterForm.limit" />

    <ul>
      @for (user of users(); track user.id) {
        <li>{{ user.name }}</li>
      }
    </ul>
  `,
})
class UserList {
  readonly #store = inject(UsersStore);

  readonly users = this.#store.users;
  readonly filter = delegatedSignal({
    source: () => ({
      query: this.#store.query(),
      limit: this.#store.limit(),
    }),
    update: ({ query, limit }) => {
      this.#store.updateFilter(query, limit);
    },
  });

  readonly filterForm = form(this.filter, (schemaPath) => {
    required(schemaPath.query);
    minLength(schemaPath.query, 2);
  });
}
```

</ngrx-code-example>
