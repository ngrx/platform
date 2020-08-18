---
kind: ClassDeclaration
name: ActionsSubject
module: store
---

# ActionsSubject

```ts
class ActionsSubject extends BehaviorSubject<Action> implements OnDestroy {
  next(action: Action): void;
  complete();
  ngOnDestroy();
}
```
