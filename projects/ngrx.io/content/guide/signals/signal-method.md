# signalMethod

`signalMethod` is a factory function that executes side effects based on signal changes. It creates one function (processing function) with one typed parameter that can be a static value or a Signal. Upon invocation, the "processing function" has to be provided.

`signalMethod` is `rxMethod` without RxJS. `signalMethod` can also be used outside of `signalStore` or `signalState`:

```ts
import {Component} from '@angular/core';
import {signalMethod} from '@ngrx/signals';

@Component({ /* ... */})
export class NumbersComponent {
  // 👇 This method will have an input argument
  // of type `number | Signal<number>`.
  readonly logDoubledNumber = signalMethod<number>(num => {
    const double = num * 2;
    console.log(double);
  })
}
```

`logDoubledNumber` can be called with a static value of type `number`, or a Signal of type `number`:

```ts

@Component({ /* ... */})
export class NumbersComponent {
  // 👇 This method will have an input argument
  // of type `number | Signal<number>`.
  readonly logDoubledNumber = signalMethod<number>(num => {
    const double = num * 2;
    console.log(double);
  })

  constructor(): void {
    // 👇 prints 2 synchronously
    this.logDoubledNumber(1);

    const value = signal(2);
    // 👇 prints 4 asynchronously (triggered by an internal effect())
    this.logDoubledNumber(value);
  }
}
```

## Automatic Signal Tracking

`signalMethod` uses an `effect` internally to track the Signal changes.

By default, the `effect` runs in the injection context of the caller. In the example above, that is `NumbersComponent`. That means, that the `effect` is automatically cleaned up when the component is destroyed.

If the call happens outside of an injection context, then the injector of the `signalMethod` is used. This would be the case, if `logDoubledNumber` runs in `ngOnInit`:

```ts

@Component({ /* ... */})
export class NumbersComponent {
  readonly logDoubledNumber = signalMethod<number>(num => {
    const double = num * 2;
    console.log(double);
  })

  ngOnInit(): void {
    this.logDoubledNumber(1);

    const value = signal(2);
    // 👇 uses the injection context of the `signalMethod`
    this.logDoubledNumber(value);
  }
}
```

For the `NumbersComponent`, it doesn't make a difference. Again, the `effect` is automatically cleaned up when the component is destroyed.

Careful, when `signalMethod` is used in a service which is provided in `root`:

```ts

@Injectable({providedIn: 'root'})
export class NumbersService {
  readonly logDoubledNumber = signalMethod<number>(num => {
    const double = num * 2;
    console.log(double);
  })
}

@Component({ /* ... */})
export class NumbersComponent {
  readonly logDoubledNumber = inject(NumbersService).logDoubledNumber;

  ngOnInit(): void {
    this.logDoubledNumber(1);

    const value = signal(2);
    // 👇 uses the injection context of the `NumbersService`, which is root.
    this.logDoubledNumber(value);
  }
}
```

Here, the `effect` outlives the component, which would produce a memory leak.

As a consequence, try to call the "processor function" always in an injection context:

```ts

@Component({ /* ... */})
export class NumbersComponent {
  readonly logDoubledNumber = inject(NumbersService).logDoubledNumber;

  ngOnInit(): void {
    this.logDoubledNumber(1);

    const value = signal(2);
    // 👇 uses the injection context of the `NumbersService`, which is root.
    this.logDoubledNumber(value);
  }
}
```

## Providing an Injector

If you cannot run the "processor function" in an injection context, you can also provide an injector manually:

```ts

@Component({ /* ... */})
export class NumbersComponent {
  readonly logDoubledNumber = inject(NumbersService).logDoubledNumber;
  readonly injector = inject(Injector);

  ngOnInit(): void {
    this.logDoubledNumber(1);

    const value = signal(2);
    // 👇 uses the injection context of the `NumbersService`, which is root.
    this.logDoubledNumber(value, {injector: this.injector});
  }
}
```

Whereas the "processor function" doesn't require an active injection context, the call of `signalMethod` does:

```ts

@Component({ /* ... */})
export class NumbersComponent {
// 👇 Would cause a runtime error
  ngOnInit() {
    const logDoubledNumber = signalMethod<number>(num => console.log(num * 2));
  }
}
```

In these cases, you also have to provide the injector manually:

```ts

@Component({ /* ... */})
export class NumbersComponent {
  readonly injector = inject(Injector);

  ngOnInit() {
    // 👇 Works now
    const logDoubledNumber = signalMethod<number>(num => console.log(num * 2), {injector: this.injector});
  }
}
```

## Advantages over simple effect

At first sight, `signalMethod`, might be the same as `effect`:

```ts

@Component({ /* ... */})
export class NumbersComponent {
  readonly value = signal(2);
  readonly logDoubledNumberEffect = effect(() => {
    const double = num * 2;
    console.log(double);
  })

  constructor(): void {
    this.logDoubledNumber(value);
  }
}
```

However, `signalMethod` offers three distinctive advantages over `effect`:

- **Flexible Parameter**: The parameter can also be a simple number, not just a Signal.
- **No Injection Context Required**: Unlike an `effect`, which requires an injection context or an Injector, `signalMethod`'s "processor function" can be called without an injection context.
- **Explicit Tracking**: Only the Signal of the parameter is tracked, while Signals within the "processor function" stay untracked.


<div class="alert is-helpful">

Be aware that RxJS is superior to Signals in managing race conditions. Signals have a glitch-free effect, meaning that for multiple synchronous changes, only the last change is propagated. Additionally, they lack powerful operators like `switchMap` or `concatMap`.

</div>
