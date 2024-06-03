# Lifecycle

NgRx ComponentStore comes with lifecycle hooks and observables for performing tasks after the ComponentStore is initially instantiated, after the initial state is first set, and when the ComponentStore is destroyed. You can use these lifecycle hooks to set up long-running effects, wire up additional logic, and other tasks outside the constructor of the ComponentStore.

## Setup

Both lifecycle hooks are enabled by providing the ComponentStore through the `provideComponentStore()` function. This function registers the ComponentStore as a provider, sets up a factory provider to instantiate the ComponentStore instance, and calls the implemented lifecycle hooks.

Currently, Angular provides initializer tokens in a few areas. The `APP_INITIALIZER` and `BOOTSTRAP_INITIALIZER` for application/bootstrap init logic, and the `ENVIRONMENT_INITIALIZER` for environment injector init logic. The `provideComponentStore()` mimics this behavior to run the lifecycle hooks. The function is required because there aren't any provided tokens at the component level injector to allow initialization tasks.

<ngrx-docs-alert type="inform">

If you implement the lifecycle hooks in the ComponentStore, and register it with `providers` without using `provideComponentStore()`, in development mode, a warning is logged to the browser console.

</ngrx-docs-alert>

## OnStoreInit

The `OnStoreInit` interface is used to implement the `ngrxOnStoreInit` method in the ComponentStore class. This lifecycle method is called immediately after the ComponentStore class is instantiated.

<ngrx-code-example header="books.store.ts">

```ts
export interface BooksState {
  collection: Book[];
}

export const initialState: BooksState = {
  collection: [],
};

@Injectable()
export class BooksStore
  extends ComponentStore<BooksState>
  implements OnStoreInit
{
  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit() {
    // called after store has been instantiated
  }
}
```

</ngrx-code-example>

<ngrx-code-example header="books-page.component.ts">

```ts
@Component({
  // ... other metadata
  providers: [provideComponentStore(BooksStore)],
})
export class BooksPageComponent {
  constructor(private booksStore: BooksStore) {}
}
```

</ngrx-code-example>

## OnStateInit

The `OnStateInit` interface is used to implement the `ngrxOnStateInit` method in the ComponentStore class. This lifecycle method is called **only once** after the ComponentStore state is initially set. ComponentStore supports eager and lazy initialization of state, and the lifecycle hook is called appropriately in either scenario.

### Eager State Init

<ngrx-code-example header="books.store.ts">

```ts
export interface BooksState {
  collection: Book[];
}

export const initialState: BooksState = {
  collection: [],
};

@Injectable()
export class BooksStore
  extends ComponentStore<BooksState>
  implements OnStateInit
{
  constructor() {
    // eager state initialization
    super(initialState);
  }

  ngrxOnStateInit() {
    // called once after state has been first initialized
  }
}
```

</ngrx-code-example>

<ngrx-code-example header="books-page.component.ts">

```ts
@Component({
  // ... other metadata
  providers: [provideComponentStore(BooksStore)],
})
export class BooksPageComponent {
  constructor(private booksStore: BooksStore) {}
}
```

</ngrx-code-example>

### Lazy State Init

<ngrx-code-example header="books.store.ts">

```ts
export interface BooksState {
  collection: Book[];
}

@Injectable()
export class BooksStore
  extends ComponentStore<BooksState>
  implements OnStateInit
{
  constructor() {
    super();
  }

  ngrxOnStateInit() {
    // called once after state has been first initialized
  }
}

export const initialState: BooksState = {
  collection: [],
};
```

</ngrx-code-example>

<ngrx-code-example header="books-page.component.ts">

```ts
@Component({
  // ... other metadata
  providers: [provideComponentStore(BooksStore)],
})
export class BooksPageComponent implements OnInit {
  constructor(private booksStore: BooksStore) {}

  ngOnInit() {
    // lazy state initialization
    this.booksStore.setState(initialState);
  }
}
```

</ngrx-code-example>

## OnDestroy

ComponentStore also implements the `OnDestroy` interface from `@angular/core` to complete any internally created observables.

It also exposes a `destroy$` property on the ComponentStore class that can be used instead of manually creating a `Subject` to unsubscribe from any observables created in the component.

<ngrx-docs-alert type="inform">

If you override the `ngOnDestroy` method in your component store, you need to call `super.ngOnDestroy()`. Otherwise a memory leak may occur.

</ngrx-docs-alert>

<ngrx-code-example header="movies.store.ts">

```ts
@Injectable()
export class MoviesStore
  extends ComponentStore<MoviesState>
  implements OnDestroy
{
  constructor() {
    super({ movies: [] });
  }

  override ngOnDestroy(): void {
    // 👇 add this line
    super.ngOnDestroy();
  }
}
```

</ngrx-code-example>

<ngrx-code-example header="books-page.component.ts">

```ts
@Component({
  // ... other metadata
  providers: [ComponentStore],
})
export class BooksPageComponent implements OnInit {
  constructor(private cs: ComponentStore) {}

  ngOnInit() {
    const timer = interval(1000)
      .pipe(takeUntil(this.cs.destroy$))
      .subscribe(() => {
        // listen until ComponentStore is destroyed
      });
  }
}
```

</ngrx-code-example>

The `provideComponentStore()` function is not required to listen to the `destroy$` property on the ComponentStore.
