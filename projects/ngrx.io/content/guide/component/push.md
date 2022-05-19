# ngrxPush Pipe

The `ngrxPush` pipe serves as a drop-in replacement for the `async` pipe.
It contains intelligent handling of change detection to enable us
running in zone-full as well as zone-less mode without any changes to the code.

Same as [LetDirective](guide/component/let), it also respects ViewEngine as well as Ivy's new rendering API.

## Usage

The `ngrxPush` pipe is provided through the `ReactiveComponentModule`. To use it, add the `ReactiveComponentModule` to the `imports` of your NgModule.

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

## Comparison with Async Pipe

The current way of binding an observable to the view looks like that:

```html
{{observable$ | async}}

<ng-container *ngIf="observable$ | async as o">{{o}}</ng-container>

<component [value]="observable$ | async"></component>
```

The problem is `async` pipe just marks the component and all its ancestors as dirty.
It needs zone.js microtask queue to exhaust until `ApplicationRef.tick` is called to render_creator all dirty marked components.

Heavy dynamic and interactive UIs suffer from zones change detection a lot and can
lean to bad performance or even unusable applications, but the `async` pipe does not work in zone-less mode.

`ngrxPush` pipe solves that problem. It can be used like shown here:

```htmlmixed
{{observable$ | ngrxPush}}

<ng-container *ngIf="observable$ | ngrxPush as o">{{o}}</ng-container>

<component [value]="observable$ | ngrxPush"></component>
```

## Included Features

 - Take observables or promises, retrieves their values, and passes the value to the template.
 - Handles `null` and `undefined` values in a clean unified/structured way.
- Triggers the change detection differently if `zone.js` is present or not
  using `ChangeDetectorRef.markForCheck` or `ɵmarkDirty`.
- Distinct the same values in a row for better performance.
