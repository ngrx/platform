# ngrxLet Structural Directive

The `*ngrxLet` directive serves a convenient way of binding observables to a view context (a dom element scope).
It also helps with several internal processing under the hood.

Same as [PushPipe](guide/component/push), it also respects ViewEngine as well as Ivy's new rendering API.

## Usage

The `*ngrxLet` directive is provided through the `ReactiveComponentModule`. To use it, add the `ReactiveComponentModule` to the `imports` of your NgModule.

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
<ng-container *ngIf="observableNumber$ | async as n">
  <app-number [number]="n">
  </app-number>
  <app-number-special [number]="n">
  </app-number-special>
</ng-container>
 ```

The problem is `*ngIf` is also interfering with rendering and in case of a falsy value the component would be hidden.

The `*ngrxLet` directive takes over several things while making it more convenient and safe to work with streams in the template.

```html
<ng-container *ngrxLet="observableNumber$ as n">
  <app-number [number]="n">
  </app-number>
</ng-container>

<ng-container *ngrxLet="observableNumber$; let n">
  <app-number [number]="n">
  </app-number>
</ng-container>
```

In addition to that it provides us information from the whole observable context.
We can track the observable notifications:

- next value
- error value
- completion state

```html
<ng-container *ngrxLet="observableNumber$; let n; let e = $error, let c = $complete">
  <app-number [number]="n"  *ngIf="!e && !c">
  </app-number>
  <ng-container *ngIf="e">
  There is an error: {{e}}
  </ng-container>
  <ng-container *ngIf="c">
  Observable completed: {{c}}
  </ng-container>
</ng-container>
```

## Included Features

- Binding is always present. (`*ngIf="truthy$"`)
- Takes away the multiple usages of the `async` or `ngrxPush` pipe
- Provides a unified/structured way of handling `null` and `undefined`
- Triggers change-detection differently if `zone.js` is present or not (`ChangeDetectorRef.detectChanges` or `ChangeDetectorRef.markForCheck`)
- Triggers change-detection differently if ViewEngine or Ivy is present (`ChangeDetectorRef.detectChanges` or `ɵdetectChanges`)
- Distinct same values in a row (distinctUntilChanged operator),
                                                                 
