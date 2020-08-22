---
kind: ClassDeclaration
name: PushPipe
module: component
---

# PushPipe

## description

The `ngrxPush` pipe serves as a drop-in replacement for the `async` pipe.
It contains intelligent handling of change detection to enable us
running in zone-full as well as zone-less mode without any changes to the code.

The current way of binding an observable to the view looks like that:

```html
{{observable$ | async}}
<ng-container *ngIf="observable$ | async as o">{{o}}</ng-container>
<component [value]="observable$ | async"></component>
```

The problem is `async` pipe just marks the component and all its ancestors as dirty.
It needs zone.js microtask queue to exhaust until `ApplicationRef.tick` is called to render_creator all dirty marked
components.

Heavy dynamic and interactive UIs suffer from zones change detection a lot and can
lean to bad performance or even unusable applications, but the `async` pipe does not work in zone-less mode.

`ngrxPush` pipe solves that problem.

Included Features:

- Take observables or promises, retrieve their values and render_creator the value to the template
- Handling null and undefined values in a clean unified/structured way
- Triggers change-detection differently if `zone.js` is present or not (`detectChanges` or `markForCheck`)
- Distinct same values in a row to increase performance
- Coalescing of change detection calls to boost performance

```ts
class PushPipe<S> implements PipeTransform, OnDestroy {
  transform<T>(
    potentialObservable: ObservableInput<T> | null | undefined
  ): T | null | undefined;
  transform<T>(potentialObservable: null): null;
  transform<T>(potentialObservable: undefined): undefined;
  transform<T>(potentialObservable: ObservableInput<T>): T;
  ngOnDestroy(): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component/src/push/push.pipe.ts#L56-L93)

## Pipe

PushPipe

## usageNotes

`ngrxPush` pipe solves that problem. It can be used like shown here:

```html
{{observable$ | ngrxPush}}
<ng-container *ngIf="observable$ | ngrxPush as o">{{o}}</ng-container>
<component [value]="observable$ | ngrxPush"></component>
```

## publicApi

## Methods

### transform

```ts
transform<T>(  potentialObservable: ObservableInput<T> | null | undefined ): T | null | undefined;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component/src/push/push.pipe.ts#L83-L88)

#### Parameters (#transform-parameters)

| Name                | Type                 | Description |
| ------------------- | -------------------- | ----------- |
| potentialObservable | `ObservableInput<T>` |             |

### transform

```ts
transform<T>(potentialObservable: null): null;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component/src/push/push.pipe.ts#L80-L80)

#### Parameters (#transform-parameters)

| Name                | Type   | Description |
| ------------------- | ------ | ----------- |
| potentialObservable | `null` |             |

### transform

```ts
transform<T>(potentialObservable: undefined): undefined;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component/src/push/push.pipe.ts#L81-L81)

#### Parameters (#transform-parameters)

| Name                | Type        | Description |
| ------------------- | ----------- | ----------- |
| potentialObservable | `undefined` |             |

### transform

```ts
transform<T>(potentialObservable: ObservableInput<T>): T;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component/src/push/push.pipe.ts#L82-L82)

#### Parameters (#transform-parameters)

| Name                | Type                 | Description |
| ------------------- | -------------------- | ----------- |
| potentialObservable | `ObservableInput<T>` |             |

### ngOnDestroy

```ts
ngOnDestroy(): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/component/src/push/push.pipe.ts#L90-L92)
