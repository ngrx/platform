# Push Pipe

The `ngrxPush` pipe serves as a drop-in replacement for the `async` pipe.
It contains intelligent handling of change detection to enable us
running in zone-full as well as zone-less mode without any changes to the code.

## Usage

The `ngrxPush` pipe is provided through the `ReactiveComponentModule`.
To use it, add the `ReactiveComponentModule` to the `imports` of your NgModule:

```typescript
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  imports: [
    // other imports
    ReactiveComponentModule
  ]
})
export class MyFeatureModule {}
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

## Included Features

- Takes observables or promises, retrieves their values, and passes the value to the template.
- Handles `null` and `undefined` values in a clean unified/structured way.
- Triggers the change detection differently if `zone.js` is present or not
  using `ChangeDetectorRef.markForCheck` or `ɵmarkDirty`.
- Distinct the same values in a row for better performance.
