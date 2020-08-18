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
  error(error: any);
  complete();
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
