# Push Pipe

The `ngrxPush` pipe serves as a drop-in replacement for the `async` pipe.
It contains intelligent handling of change detection to enable us
running in zone-full as well as zone-less mode without any changes to the code.

## Usage

The `ngrxPush` pipe is provided through the `PushModule`.
To use it, add the `PushModule` to the `imports` of your standalone component or NgModule:

```ts
import { Component } from '@angular/core';
import { PushModule } from '@ngrx/component';

@Component({
  // ... other metadata
  standalone: true,
  imports: [
    // ... other imports
    PushModule,
  ],
})
export class MyStandaloneComponent {}
```

## Comparison with `async` Pipe

The current way of binding an observable to the view looks like this:

```html
<p>{{ number$ | async }}</p>

<ng-container *ngIf="number$ | async as n">{{ n }}</ng-container>

<app-number [number]="number$ | async"></app-number>
```

The `async` pipe marks the component and all its ancestors as dirty, but does not trigger the change detection mechanism.
It needs the `zone.js` microtask queue to exhaust until `ApplicationRef.tick` is called to render all dirty marked components.
To use the `async` pipe in zone-less mode, we have to manually trigger the change detection each time an observable
emits a new value.

Fortunately, the `ngrxPush` pipe solves this problem by scheduling a new change detection cycle in zone-less mode when
an observable emits a new value. It can be used as follows:

```html
<p>{{ number$ | ngrxPush }}</p>

<ng-container *ngIf="number$ | ngrxPush as n">{{ n }}</ng-container>

<app-number [number]="number$ | ngrxPush"></app-number>
```

## Combining Multiple Observables

The `ngrxPush` pipe can be also used with a dictionary of observables in the
following way:

```html
<code>
  {{ { users: users$, query: query$ } | ngrxPush | json }}
</code>
```

## Included Features

- Takes observables or promises, retrieves their values, and passes the value to the template.
- Allows combining multiple observables in the template.
- Handles `null` and `undefined` values in a clean unified/structured way.
- Triggers change detection using the `RenderScheduler` that behaves differently in
  zone-full and zone-less mode.
- Distinct the same values in a row for better performance.
