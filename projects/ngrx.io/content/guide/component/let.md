# ngrxLet Structural Directive

The `*ngrxLet` directive serves a convenient way of binding observables to a view context
(DOM element's scope). It also helps with several internal processing under the hood.

## Usage

The `*ngrxLet` directive is provided through the `ReactiveComponentModule`.
To use it, add the `ReactiveComponentModule` to the `imports` of your NgModule:

```ts
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  imports: [
    // other imports
    ReactiveComponentModule,
  ],
})
export class MyFeatureModule {}
```

## Comparison with `*ngIf` and `async`

The current way of binding an observable to the view looks like this:

```html
<ng-container *ngIf="number$ | async as n">
  <app-number [number]="n"></app-number>
  
  <app-number-special [number]="n"></app-number-special>
</ng-container>
 ```

The problem is that `*ngIf` is interfering with rendering.
In case of `0` (falsy value), the component would be hidden.

The `*ngrxLet` directive takes over several things and makes it more convenient
and safe to work with streams in the template:

```html
<ng-container *ngrxLet="number$ as n">
  <app-number [number]="n"></app-number>
</ng-container>

<ng-container *ngrxLet="number$; let n">
  <app-number [number]="n"></app-number>
</ng-container>
```

## Tracking Different Observable Events

In addition to that it provides us information from the whole observable context.
We can track next, error, and complete events:

```html
<ng-container *ngrxLet="number$ as n; let e = $error; let c = $complete">
  <app-number [number]="n" *ngIf="!e && !c">
  </app-number>

  <p *ngIf="e">There is an error: {{ e }}</p>
  <p *ngIf="c">Observable is completed.</p>
</ng-container>
```

## Using Suspense Template

There is an option to pass the suspense template that will be displayed
when an observable is in a suspense state:

```html
<ng-container *ngrxLet="number$ as n; suspenseTpl: loading">
  <app-number [number]="n"></app-number>
</ng-container>

<ng-template #loading>
  <p>Loading...</p>
</ng-template>
```

<div class="alert is-helpful">

An observable is in a suspense state until it emits the first event (next, error, or complete).

</div>

In case a new observable is passed to the `*ngrxLet` directive at runtime,
the suspense template will be displayed again until the new observable emits the first event.

## Included Features

- Binding is present even for falsy values.
  (See ["Comparison with `*ngIf` and `async`"](#comparison-with-ngif-and-async) section)
- Takes away the multiple usages of the `async` or `ngrxPush` pipe.
- Provides a unified/structured way of handling `null` and `undefined`.
- Triggers the change detection differently if `zone.js` is present or not
  using `ChangeDetectorRef.markForCheck` or `ɵmarkDirty`.
- Distinct the same values in a row for better performance.
