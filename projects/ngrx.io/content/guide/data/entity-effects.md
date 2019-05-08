# Entity Effects

**Work in Progress**

**_Effects_** are a way to trigger _side effects_ with _actions_.

A one common, desirable _side effect_ is an asynchronous HTTP call to the remote server to fetch or save entity data.

You implement one or more _effects_ with the help of the NgRx [Effects](guide/effects) library.

_Actions_ dispatched to the _NgRx store_ can be detected and processed by your _effect_ method.
After processing, whether synchronously or asynchronously, your method can dispatch new action(s) to the _store_

The NgRx Data library implements an effect named `persist$` in its `EntityEffects` class.

The `persist$` method filters for certain `EntityAction.op` values.
These values turn into HTTP GET, PUT, POST, and DELETE requests with entity data.
When the server responds (whether favorably or with an error), the `persist$` method dispatches new `EntityAction`s to the _store_ with the appropriate response data.

#### Cancellation

You can try to cancel a save by dispatching a `CANCEL_PERSIST` EntityAction with the
**correlation id** of the _persistence action_ that you want to cancel.

The `EntityCache.cancel$` watches for this action and is piped into
the `EntityCache.persist$`, where it can try to cancel an entity collection query or save operation
or at least prevent the server response from updating the cache.

<div class="alert is-helpful">

It's not obvious that this is ever a great idea for a save operation.
You cannot tell the server to cancel this way and cannot know if the server did or did not save.
Nor can you count on processing the cancel request before the client receives the server response
and applies the changes on the server or to the cache.

If you cancel before the server results arrive, the `EntityEffect` will not try to update
the cached collection with late arriving server results.
The effect will issue a `CANCELED_PERSIST` action instead.
The `EntityCollection` reducer ignores this action but you can listen for it among the store actions
and thus know that the cancellation took effect on the client.

</div>

**_More to come on the subject of effects_**
