---
kind: InterfaceDeclaration
name: LiftedState
module: store-devtools
---

# LiftedState

```ts
interface LiftedState {
  monitorState: any;
  nextActionId: number;
  actionsById: LiftedActions;
  stagedActionIds: number[];
  skippedActionIds: number[];
  committedState: any;
  currentStateIndex: number;
  computedStates: ComputedState[];
  isLocked: boolean;
  isPaused: boolean;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/reducer.ts#L39-L50)
