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
