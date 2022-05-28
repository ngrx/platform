# Lifecycle

NgRx ComponentStore comes with lifecycle hooks and observables for performing tasks after the ComponentStore is initially instantiated, after the initial state is first set, and when the ComponentStore is destroyed. You can use these lifecycle hooks to set up long-running effects, wire up additional logic, and other tasks outside the constructor of the ComponentStore.

## Setup

Both lifecycle hooks are enabled by providing the ComponentStore through the `provideComponentStore()` function. This function registers the ComponentStore as a provider, sets up a factory provider to instantiate the ComponentStore instance, and calls the implemented lifecycle hooks.

Currently, Angular provides initializer tokens in a few areas. The `APP_INITIALIZER` and `BOOTSTRAP_INITIALIZER` for application/bootstrap init logic, and the `ENVIRONMENT_INITIALIZER` for environment injector init logic. The `provideComponentStore()` mimics this behavior to run the lifecycle hooks. The function is required because there aren't any provided tokens at the component level injector to allow initialization tasks.

<div class="alert is-important">

**Note:** If you implement the lifecycle hooks in the ComponentStore, and register it with `providers` without using `provideComponentStore()`, in development mode, a warning is logged to the browser console.

</div>

## OnStoreInit

The `OnStoreInit` interface is used the implement the `ngrxOnStoreInit` method in the ComponentStore class. This lifecycle method is called immediately after the ComponentStore class is instantiated.

<code-example header="books.store.ts">
export interface BooksState {
  collection: Book[];
}

export const initialState: BooksState = {
  collection: []
};

@Injectable()
export class BooksStore extends ComponentStore&lt;BooksState&gt; implements OnStoreInit {

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit() {
    // called after store has been instantiated
  }
}
</code-example>

<code-example header="books-page.component.ts">
@Component({
  // ... other metadata
  providers: [
    provideComponentStore(BooksStore)
  ]
})
export class BooksPageComponent {
  constructor(private booksStore: BooksStore) {}
}
</code-example>

## OnStateInit

The `OnStateInit` interface is used the implement the `ngrxOnStateInit` method in the ComponentStore class. This lifecycle method is called **only once** after the ComponentStore state is initially set. ComponentStore supports eager and lazy initialization of state, and the lifecycle hook is called appropriately in either scenario.

### Eager State Init

<code-example header="books.store.ts">
export interface BooksState {
  collection: Book[];
}

export const initialState: BooksState = {
  collection: []
};

@Injectable()
export class BooksStore extends ComponentStore&lt;BooksState&gt; implements OnStateInit {
  constructor() {
    // eager state initialization
    super(initialState);
  }

  ngrxOnStateInit() {
    // called once after state has been first initialized
  }
}
</code-example>

<code-example header="books-page.component.ts">
@Component({
  // ... other metadata
  providers: [
    provideComponentStore(BooksStore)
  ]
})
export class BooksPageComponent {
  constructor(private booksStore: BooksStore) {}
}
</code-example>

### Lazy State Init

<code-example header="books.store.ts">
export interface BooksState {
  collection: Book[];
}

@Injectable()
export class BooksStore extends ComponentStore&lt;BooksState&gt; implements OnStateInit {
  constructor() {
    super();
  }

  ngrxOnStateInit() {
    // called once after state has been first initialized
  }
}

export const initialState: BooksState = {
  collection: []
};
</code-example>

<code-example header="books-page.component.ts">
@Component({
  // ... other metadata
  providers: [
    provideComponentStore(BooksStore)
  ]
})
export class BooksPageComponent implements OnInit {
  constructor(private booksStore: BooksStore) {}

  ngOnInit() {
    // lazy state initialization
    this.booksStore.setState(initialState);
  }
}
</code-example>

## OnDestroy

ComponentStore also implements the `OnDestroy` interface from `@angulare/core` to complete any internally created observables.

It also exposes a `destroy$` property on the ComponentStore class that can be used instead of manually creating a `Subject` to unsubscribe from any observables created in the component.

<code-example header="books-page.component.ts">
@Component({
  // ... other metadata
  providers: [ComponentStore]
})
export class BooksPageComponent implements OnInit {
  constructor(private cs: ComponentStore) {}

  ngOnInit() {
    const timer = interval(1000)
      .pipe(takeUntil(this.cs.destroy$))
      .subscribe(() =&gt; {
        // listen until ComponentStore is destroyed
      });
  }
}
</code-example>

The `provideComponentStore()` function is not required to listen to the `destroy$` property on the ComoponentStore.
