---
kind: ClassDeclaration
name: StoreDevtools
module: store-devtools
---

# StoreDevtools

```ts
class StoreDevtools implements Observer<any> {
  public dispatcher: ActionsSubject;
  public liftedState: Observable<LiftedState>;
  public state: Observable<any>;

  dispatch(action: Action);
  next(action: any);
  performAction(action: any);
  refresh();
  reset();
  rollback();
  commit();
  sweep();
  toggleAction(id: number);
  jumpToAction(actionId: number);
  jumpToState(index: number);
  importState(nextLiftedState: any);
  lockChanges(status: boolean);
  pauseRecording(status: boolean);
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L33-L186)

## Methods

### dispatch

```ts
dispatch(action: Action);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L127-L129)

#### Parameters (#dispatch-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` |             |

### next

```ts
next(action: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L131-L133)

#### Parameters (#next-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` |             |

### error

```ts
error(error: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L135-L135)

#### Parameters (#error-parameters)

| Name  | Type  | Description |
| ----- | ----- | ----------- |
| error | `any` |             |

### complete

```ts
complete();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L137-L137)

### performAction

```ts
performAction(action: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L139-L141)

#### Parameters (#performAction-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| action | `any` |             |

### refresh

```ts
refresh();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L143-L145)

### reset

```ts
reset();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L147-L149)

### rollback

```ts
rollback();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L151-L153)

### commit

```ts
commit();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L155-L157)

### sweep

```ts
sweep();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L159-L161)

### toggleAction

```ts
toggleAction(id: number);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L163-L165)

#### Parameters (#toggleAction-parameters)

| Name | Type     | Description |
| ---- | -------- | ----------- |
| id   | `number` |             |

### jumpToAction

```ts
jumpToAction(actionId: number);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L167-L169)

#### Parameters (#jumpToAction-parameters)

| Name     | Type     | Description |
| -------- | -------- | ----------- |
| actionId | `number` |             |

### jumpToState

```ts
jumpToState(index: number);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L171-L173)

#### Parameters (#jumpToState-parameters)

| Name  | Type     | Description |
| ----- | -------- | ----------- |
| index | `number` |             |

### importState

```ts
importState(nextLiftedState: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L175-L177)

#### Parameters (#importState-parameters)

| Name            | Type  | Description |
| --------------- | ----- | ----------- |
| nextLiftedState | `any` |             |

### lockChanges

```ts
lockChanges(status: boolean);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L179-L181)

#### Parameters (#lockChanges-parameters)

| Name   | Type      | Description |
| ------ | --------- | ----------- |
| status | `boolean` |             |

### pauseRecording

```ts
pauseRecording(status: boolean);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/devtools.ts#L183-L185)

#### Parameters (#pauseRecording-parameters)

| Name   | Type      | Description |
| ------ | --------- | ----------- |
| status | `boolean` |             |

## Parameters

| Name        | Type                      | Description |
| ----------- | ------------------------- | ----------- |
| dispatcher  | `any`                     |             |
| liftedState | `Observable<LiftedState>` |             |
| state       | `Observable<any>`         |             |
