# RxJS Integration

RxJS is still a major part of NgRx and the Angular ecosystem, and the `@ngrx/signals` package provides **opt-in** integration with RxJS APIs through the `rxjs-interop` plugin.

## RxMethod

The `rxMethod` is a standalone factory function designed for managing side effects by utilizing RxJS APIs.
It takes a chain of RxJS operators as input and returns a reactive method.
The reactive method can accept a static value, signal, or observable as an input argument.
Input can be typed by providing a generic argument to the `rxMethod` function.

```ts
import { Component } from '@angular/core';
import { map, pipe, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent {
  // 👇 This reactive method will have an input argument
  // of type `number | Signal<number> | Observable<number>`.
  readonly logDoubledNumber = rxMethod<number>(
    // 👇 RxJS operators are chained together using the `pipe` function.
    pipe(
      map((num) => num * 2),
      tap(console.log)
    )
  );
}
```

Each invocation of the reactive method pushes the input value through the reactive chain.
When called with a static value, the reactive chain executes once.

```ts
import { Component, OnInit } from '@angular/core';
import { map, pipe, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly logDoubledNumber = rxMethod<number>(
    pipe(
      map((num) => num * 2),
      tap(console.log)
    )
  );

  ngOnInit(): void {
    this.logDoubledNumber(1);
    // console output: 2

    this.logDoubledNumber(2);
    // console output: 4
  }
}
```

When a reactive method is called with a signal, the reactive chain is executed every time the signal value changes.

```ts
import { Component, OnInit, signal } from '@angular/core';
import { map, pipe, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly logDoubledNumber = rxMethod<number>(
    pipe(
      map((num) => num * 2),
      tap(console.log)
    )
  );

  ngOnInit(): void {
    const num = signal(10);
    this.logDoubledNumber(num);
    // console output: 20

    num.set(20);
    // console output: 40
  }
}
```

When a reactive method is called with an observable, the reactive chain is executed every time the observable emits a new value.

```ts
import { Component, OnInit } from '@angular/core';
import { interval, map, of, pipe, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly logDoubledNumber = rxMethod<number>(
    pipe(
      map((num) => num * 2),
      tap(console.log)
    )
  );

  ngOnInit(): void {
    const num1$ = of(100, 200, 300);
    this.logDoubledNumber(num1$);
    // console output: 200, 400, 600

    const num2$ = interval(2_000);
    this.logDoubledNumber(num2$);
    // console output: 0, 2, 4, 6, 8, 10, ... (every 2 seconds)
  }
}
```

By default, the `rxMethod` needs to be executed within an injection context.
It's tied to its lifecycle and is automatically cleaned up when the injector is destroyed.

### Handling API Calls

The `rxMethod` is a great choice for handling API calls in a reactive manner.
The subsequent example demonstrates how to use `rxMethod` to fetch the book by id whenever the `selectedBookId` signal value changes.

```ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { concatMap, filter, pipe } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Book } from './book.model';
import { BooksService } from './books.service';

@Component({ /* ... */ })
export class BooksComponent implements OnInit {
  readonly #booksService = inject(BooksService);

  readonly bookMap = signal<Record<string, Book>>({});
  readonly selectedBookId = signal<string | null>(null);

  readonly loadBookById = rxMethod<string | null>(
    pipe(
      filter((id) => !!id && !this.bookMap()[id]),
      concatMap((id) => {
        return this.#booksService.getById(id).pipe(
          tapResponse({
            next: (book) => this.addBook(book),
            error: console.error,
          })
        );
      })
    )
  );

  ngOnInit(): void {
    // 👇 Load book by id whenever the `selectedBookId` value changes.
    this.loadBookById(this.selectedBookId);
  }

  addBook(book: Book): void {
    this.bookMap.update((bookMap) => ({ ...bookMap, [book.id]: book }));
  }
}
```

<div class="alert is-important">

For safe handling of API responses, it is recommended to use the `tapResponse` operator from the `@ngrx/operators` package.
Learn more about it in the [tapResponse](guide/operators/operators#tapresponse) guide.

</div>

The `rxMethod` function can also be utilized to define reactive methods for SignalStore.
Further details can be found in the [Reactive Store Methods](guide/signals/signal-store#reactive-store-methods) guide.

### Reactive Methods without Arguments

To create a reactive method without arguments, the `void` type should be specified as a generic argument to the `rxMethod` function.

```ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { exhaustMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Book } from './book.model';
import { BooksService } from './books.service';

@Component({ /* ... */ })
export class BooksComponent implements OnInit {
  readonly #booksService = inject(BooksService);
  readonly books = signal<Book[]>([]);

  // 👇 Creating a reactive method without arguments.
  readonly loadAllBooks = rxMethod<void>(
    exhaustMap(() => {
      return this.#booksService.getAll().pipe(
        tapResponse({
          next: (books) => this.books.set(books),
          error: console.error,
        })
      );
    })
  );

  ngOnInit(): void {
    this.loadAllBooks();
  }
}
```

### Reactive Methods and Injector Hierarchies

The cleanup behavior of reactive methods differs when they're created and called across different injector hierarchies.

If the reactive method is called within the descendant injection context, the call will be automatically cleaned up when the descendant injector is destroyed.
However, when the call is made outside of the descendant injection context, it's necessary to explicitly provide the descendant injector reference to ensure proper cleanup. Otherwise, the cleanup occurs when the ascendant injector where the reactive method is initialized gets destroyed.

```ts
import { Component, inject, Injectable, Injector, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NumbersService {
  readonly log = rxMethod<number>(tap(console.log));
}

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly #injector = inject(Injector);
  readonly #numbersService = inject(NumbersService);

  constructor() {
    const num1$ = interval(1_000);
    // 👇 Automatic cleanup when component is destroyed.
    this.#numbersService.log(num1$);
  }

  ngOnInit(): void {
    const num2$ = interval(2_000);
    // 👇 Requires injector for cleanup when component is destroyed.
    this.#numbersService.log(num2$, { injector: this.#injector });
  }
}
```

<div class="alert is-important">

If the injector is not provided when calling the reactive method with a signal or observable outside the injection context, a warning message about a potential memory leak is displayed in development mode.

</div>

### Manual Cleanup

If a reactive method needs to be cleaned up before the injector is destroyed, manual cleanup can be performed by calling the `destroy` method.

```ts
import { Component, OnInit } from '@angular/core';
import { interval, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly logNumber = rxMethod<number>(tap(console.log));

  ngOnInit(): void {
    const num1$ = interval(500);
    const num2$ = interval(1_000);

    this.logNumber(num1$);
    this.logNumber(num2$);

    setTimeout(() => {
      // 👇 Destroy the reactive method after 3 seconds.
      this.logNumber.destroy();
    }, 3_000);
  }
}
```

When invoked, the reactive method returns the object with the `destroy` method.
This allows manual cleanup of a specific call, preserving the activity of other reactive method calls until the corresponding injector is destroyed.

```ts
import { Component, OnInit } from '@angular/core';
import { interval, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly logNumber = rxMethod<number>(tap(console.log));

  ngOnInit(): void {
    const num1$ = interval(500);
    const num2$ = interval(1_000);

    const num1Ref = this.logNumber(num1$);
    const num2Ref = this.logNumber(num2$);

    setTimeout(() => {
      // 👇 Destroy the first reactive method call after 2 seconds.
      num1Ref.destroy();
    }, 2_000);
  }
}
```

### Initialization Outside of Injection Context

Initialization of the reactive method outside an injection context is possible by providing an injector as the second argument to the `rxMethod` function.

```ts
import { Component, inject, Injector, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@Component({ /* ... */ })
export class NumbersComponent implements OnInit {
  readonly #injector = inject(Injector);

  ngOnInit(): void {
    const logNumber = rxMethod<number>(
      tap(console.log),
      { injector: this.#injector }
    );

    logNumber(10);
  }
}
```