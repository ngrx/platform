 # coalesce

Limits the number of synchronous emitted a value from the source Observable to
one emitted value per [`AnimationFrame`](https://developer.mozilla.org/en-US/search?q=AnimationFrame),
then repeats this process for every tick of the browsers event loop.

The coalesce operator is based on the [throttle](https://rxjs-dev.firebaseapp.com/api/operators/throttle) operator.
In addition to that is provides emitted values for the trailing end only, as well as maintaining a context to scope coalescing.

<figure>
  <img src="generated/images/guide/component/coalesce.png" alt="coalesce Operator Marble Diagram" width="100%" height="100%" />
</figure>

<figure>
  <img src="generated/images/guide/component/coalesce_2.png" alt="coalesce Operator Marble Diagram (v2)" width="100%" height="100%" />
</figure>

 ## Description
 
 Rendering, in most web applications, is by far the most performance crucial part.
 The `coalesce` operator's general purpose is to buffer synchronous emissions together 
 to a single emission per `AnimationFrame`,
 enabling the user to fire potential view renderings only once even if multiple values are changed across the passed context. 
 render changes only once per `animationFrame`.
 By default, changes will be emitted on the trailing edge of an `AnimationFrame`.
 This behavior is fully configurable by the `durationSelector`.
 
 Additionally, the `coalesce` operator provides the option to define a custom coalescing scope via the passed `config` object. 
 If provided, the buffered changes of the source will only be emitted once per scope.
 This is especially helpful in scenarios where you want to have only one emission across multiple usages of the operator.
 
 You find a more in depth explanation in the [usage of context scoping](#usage-of-context-scoping) section of this document.
 
 ## Basic usage
  
  By default the coalesce operator helps you to buffer incoming values within an animationFrame and emits once per browser event-loop tick.
  This example demonstrates how the render method is only called once thus having four changes of the source stream.
 ```typescript
 import { coalesce } from '@ngrx/component';
 import { range } from '@rxjs';
  
 const source$ = range(1, 4); // stream of data
 source$.pipe(
     coalesce()
 ).subscribe(stateChanges => {
     render(); // render method will be called once for the value 4 of the stream
 });
 ```
 ## Parameters
 
  **durationSelector:**
   
  Optional. Default is `defaultCoalesceDurationSelector` (coalescing by animationFrame)
  A function that receives a value from the source Observable, for computing the silencing duration for each source value, returned as an Observable or a Promise.
  
   **config:**
   
   Optional. Default is `defaultCoalesceConfig` ({ leading: false, trailing: true }` & scoping per Subscriber aka no scoping).
 
 ### Usage of Leading/Training 
 
The flags `leading` and `trailing` help to determine which values should be forwarded.

Imagine you have a observable that emits a number of values synchronously. e.g. `range(1,10)`.

Setting `leading` to true would result in the emissions `1`.
Setting `trailing` to true would result in the emissions `10`.
Setting `leading` and `trailing` to true would result in the emissions `1, 10`.

```typescript
 import { coalesce } from '@ngrx/component';
 import { range } from '@rxjs';
  
 const source$ = range(1, 4); // synchronous emitted values
 source$.pipe(
     coalesce({leading: true, tailing: true})
 ).subscribe(v => console.log(v)); // 1, 10
 ```
 
 ### Usage of Context Scoping
 If multiple coalesce operators are configured with the same scope object, only one change will be emitted to the first `Subscriber`.
 This simple example shows how it is possible to coalesce multiple subscribers to one shared scope object. This will result in 
 only one rendering call thus having multiple subscribers to the incoming stream.
 
 ```typescript
 import { coalesce } from '@ngrx/component';
 import { range, animationFrames } from '@rxjs';
  
 const source$ = range(1, 10); // synchronous emitted values
 const coalesceConfig = {
    context: {} // e.g. this.componentRef;
 };

 source$.pipe(
     coalesce(() => animationFrames(), coalesceConfig)
 ).subscribe(stateChanges => {
     render(stateChanges); // render method will be called once for the value 4 of the stream
 });

 source$.pipe(
     coalesce(() => generateFrames(), coalesceConfig)
 ).subscribe(stateChanges => {
    render(stateChanges);
});
// view doesn't get rendered, since the value will be emitted only once per scope
   ```
 

