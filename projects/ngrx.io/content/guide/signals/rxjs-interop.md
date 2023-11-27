## Opt-in Interopability with RxJS

RxJS is still a major part of NgRx and the Angular ecosystem, and the NgRx Signals package provides **opt-in** usage to interact with RxJS observables using the rxMethod function.

The `rxMethod` function allows you to define a method that can receive a signal or observable, read its latest values, and perform additional operations with an observable.

```ts
import { inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
  signalStore,
  patchState,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';

import { User } from './user.model';
import { UsersService } from './users.service';

type State = { users: User[]; isLoading: boolean; query: string };

const initialState: State = {
  users: [],
  isLoading: false,
  query: '',
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, usersService = inject(UsersService)) =&gt; ({
    updateQuery(query: string) {
      patchState(store, { query });
    },
    async loadAll() {
      patchState(store, { isLoading: true });
      const users = await usersService.getAll();
      patchState(store, { users, isLoading: false });
    },
    loadByQuery: rxMethod&lt;;string&gt;(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() =&gt; patchState(store, { isLoading: true })),
        switchMap((query) =&gt;
          usersService.getByQuery(query).pipe(
            tapResponse({
              next: (users) =&gt; patchState(store, { users }),
              error: console.error,
              finalize: () =&gt; patchState(store, { isLoading: false }),
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit({ loadByQuery, query }) {
      loadByQuery(query);
    },
  }),
);
```

The example `UserStore` above uses the `rxMethod` operator to create a method that loads the users on initialization of the store based on a query string.

The `UsersStore` can then be used in the component, along with its additional methods, providing a clean, structured way to manage state with signals, combined with the power of RxJS observable streams for asynchronous behavior.

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SearchBoxComponent } from './ui/search-box.component';
import { UserListComponent } from './ui/user-list.component';
import { UsersStore } from './users.store';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SearchBoxComponent, UserListComponent],
  template: `
    &lt;h1&gt;Users (RxJS Integration)&lt;/h1&gt;

    &lt;app-search-box
      [query]="store.query()"
      (queryChange)="store.updateQuery($event)"
    /&gt;

    &lt;app-user-list [users]="store.users()" [isLoading]="store.isLoading()" /&gt;
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent {
  readonly store = inject(UsersStore);
}
```