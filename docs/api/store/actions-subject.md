---
kind: ClassDeclaration
name: ActionsSubject
module: store
---

# ActionsSubject

```ts
class ActionsSubject extends BehaviorSubject<Action> implements OnDestroy {
  next(action: Action): void;
  ngOnDestroy();
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/actions_subject.ts#L8-L36)

## Methods

### next

```ts
next(action: Action): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/actions_subject.ts#L15-L27)

#### Parameters (#next-parameters)

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| action | `Action` |             |

### complete

```ts
complete();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/actions_subject.ts#L29-L31)

### ngOnDestroy

```ts
ngOnDestroy();
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/actions_subject.ts#L31-L33)
