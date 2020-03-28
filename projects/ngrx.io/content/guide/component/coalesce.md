 # coalesce
 
 Emits a value from the source observable on the trailing edge of an interval, then ignores subsequent
 source values for a duration determined by another Observable (`durationSelector`), then repeats this process.

 The coalesce operator is based on the [throttle](https://rxjs-dev.firebaseapp.com/api/operators/throttle) operator.
 
<figure>
  <img src="generated/images/guide/component/coalesce.png" alt="coalesce Operator Marble Diagram" width="100%" height="100%" />
</figure>

<figure>
  <img src="generated/images/guide/component/coalesce_2.png" alt="coalesce Operator Marble Diagram (v2)" width="100%" height="100%" />
</figure>

 ## Description
 
 Rendering, in most web applications, is by far the most performance crucial part.
 The `coalesce` operator's general purpose is to buffer state changes together 
 to a single emission per `animationFrame`, enabling the user to render changes only once per `animationFrame`.
 By default, changes will be emitted on the trailing edge of an `animationFrame`.
 This behavior is fully configurable by the `durationSelector`.
 
 However, the `coalesce` operator provides the option to define a custom coalescing scope via the `config`. 
 If provided, the buffered changes of the source will only be emitted once per scope.
 This is especially helpful in scenarios where you want to have only one emission across multiple usages of the operator.
 
 You find a more in depth explanation in the [Usage](#scoping) section of this document.
 
 ## Signature
  ```typescript
  coalesce<T>(durationSelector: (value: T) => SubscribableOrPromise<any>, config: CoalesceConfig): MonoTypeOperatorFunction<T>;
  
  // Defaults  
  defaultCoalesceDurationSelector = <T>(value: T) => generateFrames();
      
  defaultCoalesceConfig: CoalesceConfig = {
        context: {isCoalescing: false},
        leading: false,
        trailing: true
  };
```
 ## Configuration
 
  **durationSelector:**
   
  Optional. Default is `defaultCoalesceDurationSelector` (coalescing by animationFrame)
  A function that receives a value from the source Observable, for computing the silencing duration for each source value, returned as an Observable or a Promise.
  
   **config:**
   
   Optional. Default is `defaultCoalesceConfig` ({ leading: false, trailing: true }` & scoping per Subscriber aka no scoping)
   By default the coalescing operator emits on the trailing end of the defined durationSelector and per Subscriber. The context can be any object.

 ## Usage
 
 ### Basic usage
 
 By default the coalesce operator helps you to buffer incoming values within an animationFrame and emits once at the end.
 This example demonstrates how the render method is only called once thus having four changes of the source stream.
```typescript
import { coalesce } from 'rxjs-state';
import { range } from '@rxjs';
 
const source$ = range(1, 4); // stream of data
source$.pipe(
    coalesce()
).subscribe(stateChanges => {
    render(); // render method will be called once for the value 4 of the stream
});

  ```
 ### Scoping
 If multiple coalesce operators are configured with the same scope object, only one change will be emitted to the first `Subscriber`.
 This simple example shows how it is possible to coalesce multiple subscribers to one shared scope object. This will result in 
 only one rendering call thus having multiple subscribers to the incoming stream.
 
 ```typescript
 import { coalesce, generateFrames } from 'rxjs-state';
 import { range } from '@rxjs';
  
 const source$ = range(1, 4); // stream of data
 const coalesceConfig = {
    context: {} // e.g. this.componentRef;
 };

 source$.pipe(
     coalesce(() => generateFrames(), coalesceConfig)
 ).subscribe(stateChanges => {
     render(); // render method will be called once for the value 4 of the stream
 });

 source$.pipe(
     coalesce(() => generateFrames(), coalesceConfig)
 ).subscribe(stateChanges => {
    render();
});
// view doesn't get rendered, since the value will be emitted only once per scope
   ```
 

