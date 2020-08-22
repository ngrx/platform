---
kind: ClassDeclaration
name: State
module: store
---

# State

```ts
class State<T> extends BehaviorSubject<any> implements OnDestroy {
  static readonly INIT = INIT;

  ngOnDestroy();
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/state.ts#L18-L61)

## Methods

### ngOnDestroy

```ts
ngOnDestroy();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/state.ts#L57-L60)

## Parameters

| Name | Type                 | Description |
| ---- | -------------------- | ----------- |
| INIT | `"@ngrx/store/init"` |             |
