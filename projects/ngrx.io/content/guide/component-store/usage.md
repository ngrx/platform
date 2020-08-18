# Usage

## Types of State

There are multiple types of state that exist in the application, and state management libraries are there to help manage/synchronize/update them. The topic of which one, ComponentStore or the Global Store you should choose, or maybe both would be helpful, is described at [ComponentStore vs Store](guide/component-store/comparison) section.

The types of state that developers typically deal with in applications are:
* **Server/Backend(s) State**. This is the ultimate source of truth of all the data.
* **Persisted State**. The "snapshots" of backend data transferred *to* and *from* application. E.g. Movies data passed as a JSON response, or user's rating for a particular Movie passed as an update request.
* **URL State**. The state of the URL itself. Depending on which URL use navigates to, the app would open specific pages and thus might request for *Persisted State*.
* **Client State**. The state within application that is not persisted to the backend. E.g. The info about which Tab is open in the application.
* **Local UI State**. The state within a component itself. E.g. `isEnabled` toggle state of Toggle Component.

<figure>
  <img src="generated/images/guide/component-store/types-of-state.png" alt="Types of state in a typical SPA" width="100%" height="100%" />
</figure>

There are more types of states, but these are the most important ones in the context of state management.

<div class="alert is-important">

Synchronizing these states is one of the most complex tasks that developers have to solve.

</div>

Here is a small example to demonstrate how even a simple task might involve all of them:

1. The user opens the page at specific URL - "https://TheBestMoviesOfAllTimeEver.com/favorites" - that changes ***URL State***. 
1. URL had a path for a specific tab - "favorites" - that selection becomes part of ***Client State***. 
1. Now, that results in API calls to the backend to get the data of the movies that user marked as "favorites" - we get the snapshot of ***Persisted State***.
1. The Toggle Component that lives next to *"is favorite"* label is turned ON. The "ON" state is derived from the data that application received and passed to Toggle Component through `@Input() isEnabled: boolean`. The component itself is not aware of *Persisted State*, or what it even means to be ON in the context of the rest of the application. All it knows that it needs to be visually displayed as ON - `isEnabled` state is ***Local UI State***.
1. The user might decided that this movie is no longer their favorite, and would click the Toggle button. The *Local UI State* of the component is then changed, the `@Output() changed` event is emitted and picked up by the container component, which then would call the backend to update the new *Persisted State*. 

This was a very simple example, typically developers have to solve many more interconnected problems. What if the user is not logged in? Should we wait until the new favorite state is persisted to the backend and only then show disabled state, or should we do this optimistically? and etc.

<div class="alert is-helpful">

The understanding of these state would help us define the usage of ComponentStore.

</div>

## Use Case 1: Local UI State

### Example 1: ComponentStore as part of component

The simplest example of the usage of `ComponentStore` would be the **reactive *Local UI State***.

One of the ways to improve the performance of the application is to use `OnPush` change detection strategy. However, contrary to the popular belief, we do not always need to tell Angular's change detection to `markForCheck()` or `detectChanges()` (or the Ivy's alternatives). As pointed in [the article on change detection](https://indepth.dev/the-last-guide-for-angular-change-detection-youll-ever-need/), if the event originates from the component it would be checked.
That means that presentational (aka dumb) common components, that interact with the rest of the application with Input(s)/Output(s) might not need to be overcomplicated with reactive state - just like the Toggle Component mentioned above.

Having said that, in most cases making *Local UI State* **reactive** is beneficial:
* Zoneless application - where `async` pipe can be easily substituted with Zoneless alternative
* Components with non-trivial business logic - reactivity can organize the state better, clearly separating actual state from derived values, identify side-effects.

ComponentStore is not the only reactive *Local UI State* holder - sometimes `FormControl`s are good enough. They contain the state and they have reactive APIs.

Here's the simplified `SlideToggleComponent` example that uses `ComponentStore` for *Local UI State*. In this example, the `ComponentStore` is provided directly to the component itself, which might not be the best choice for most of the use cases of `ComponentStore`.

<div class="alert is-helpful">

You can see the full example at Stackblitz: <live-example name="component-store-slide-toggle"></live-example>

</div>

<code-tabs linenums="true">
  <code-pane
    header="slide-toggle.component.ts"
    path="component-store-slide-toggle/src/app/slide-toggle.component.ts">
  </code-pane>
  <code-pane
    header="slide-toggle.html"
    path="component-store-slide-toggle/src/app/slide-toggle.html">
  </code-pane>
</code-tabs>

Below are the steps of integrating `ComponentStore` into a component.

#### Step 1. Setting up

First, the state for the component needs to be identified. In `SlideToggleComponent` only the state of whether the toggle is turned ON or OFF is stored.

<code-example
  path="component-store-slide-toggle/src/app/slide-toggle.component.ts"
  region="state"></code-example>

Then we need to provide `ComponentStore` in the component's providers, so that each new instance of `SlideToggleComponent` has its own `ComponentStore`. It also has to be injected into the constructor.

<div class="alert is-important">

In this example `ComponentStore` is provided directly in the component. This works for simple cases, however in real-world cases it is recommended to create a separate Service, for example `SlideToggleStore`, that would extend `ComponentStore` and would contain all the business logic. This new Service is then provided in the component. See examples below.

</div>

<code-example
  path="component-store-slide-toggle/src/app/slide-toggle.component.ts"
  region="providers"></code-example>

Next, the default state for the component needs to be set. It could be done lazily, however it needs to be done before any of `updater`s are executed, because they rely on the state to be present and would throw an error if the state is not initialized by the time they are invoked.

State is initialized by calling `setState` and passing an object that matches the interface of `SlideToggleState`.

<div class="alert is-important">

`setState` could be called with either an object or a callback.

When it is called with an object, state is initialized or reset to that object.

When it is called with a callback, the state is updated.

</div>

<code-example
  path="component-store-slide-toggle/src/app/slide-toggle.component.ts"
  region="init"></code-example>

#### Step 2. Updating state

In the slide-toggle example, the state is updated either through `@Input` or by a user interaction, which results in `onChangeEvent($event)` call in the template. Both of them change the same piece of state - `checked: boolean`, thus we have `setChecked` updater that is reused in two places. This updater describes **HOW** the state changes - it takes the current state and a value and returns the new state.

`@Input` here is a setter function that passes the value to the `setChecked` updater.

When a user clicks the toggle, instead of calling the same updater directly, the `onChangeEvent` effect is called. This is done because we also need to have the side-effect of `event.stopPropagation()` and only after that the `setChecked` updater is called with the value of the input element.

<code-example
  path="component-store-slide-toggle/src/app/slide-toggle.component.ts"
  region="updater"></code-example>

#### Step 3. Reading the state

Finally, the state is aggregated with selectors into two properties:
* `vm$` property collects all the data needed for the template - this is *ViewModel* of `SlideToggleComponent`. 
* `change` is the `@Output` of `SlideToggleComponent`. Instead of creating `EventEmitter` and push the data through it, here the output is connected to the Observable source directly.

<code-example
  path="component-store-slide-toggle/src/app/slide-toggle.component.ts"
  region="selector"></code-example>

This example does not have a lot of business logic, however it is still fully reactive.

#### Zoneless

In the template of `SlideToggleComponent` we used `async` pipe to unwrap the Observable, however in the Zoneless environment it will not work. In such cases, [ngrxPush pipe](guide/component/push) can be used instead. 


### Example 2: Service extending ComponentStore

`SlideToggleComponent` is a fairly simple component and having `ComponentStore` within the component itself is still manageable. When components takes more Inputs and/or has more events within its template, it becomes larger and harder to read/maintain.

Extracting the business logic of a component into a separate Service also helps reduce the cognitive load while reading the components code.

<div class="alert is-important">

A Service that extends ComponentStore and contains business logic of the component brings many advantages. **This is also the recommended usage of ComponentStore**.

</div>

`ComponentStore` was designed with such approach in mind. The main APIs of `ComponentStore` (`updater`, `effect` and `select`) are meant to wrap the **HOW** state is changed, extracted or effected, and then provided with inputs.

Below are the two examples of re-implemented [Paginator component](https://material.angular.io/components/paginator/overview) from Angular Material library of UI components. These re-implementations are very functionally close alternatives.

Here's the source code of the [Material's paginator.ts](https://github.com/angular/components/blob/23d3c216c65b327e0acfb48b53302b8fda326e7f/src/material/paginator/paginator.ts#L112) for the reference.

What we can see is that while *"PaginatorComponent providing ComponentStore"* example already makes component a lot smaller, reactive, removes `this._changeDetectorRef.markForCheck()` and organizes it into distinct "read"/"write"/"effect" buckets, it still could be harder to read. *"PaginatorComponent with PaginatorStore"* example adds readability and further improves testability of behaviors and business logic.

<div class="alert is-helpful">

You can see the examples at Stackblitz:
* "PaginatorComponent providing ComponentStore" <live-example name="component-store-paginator" noDownload></live-example>
* "PaginatorComponent with PaginatorStore Service" <live-example name="component-store-paginator-service" noDownload></live-example>

</div>

<code-tabs linenums="true">
  <code-pane
    header="PaginatorComponent with PaginatorStore Service"
    path="component-store-paginator-service/src/app/paginator.component.ts">
  </code-pane>
  <code-pane
    header="PaginatorComponent providing ComponentStore"
    path="component-store-paginator/src/app/paginator.component.ts">
  </code-pane>
  <code-pane
    header="paginator.store.ts"
    path="component-store-paginator-service/src/app/paginator.store.ts">
  </code-pane>
</code-tabs>

#### Updating the state

With `ComponentStore` extracted into `PaginatorStore`, the developer is now using updater and effects to update the state. Effects are used to perform additional validation and get extra information from sources with derived data (e.i. selectors).

<code-example
  path="component-store-paginator-service/src/app/paginator.component.ts"
  region="updating-state"></code-example>

#### Reading the state

`PaginatorStore` exposes the two properties: `vm$` for aggregated *ViewModel* to be used in the template, and `page$` that would emitted whenever data aggregated of `PageEvent` changes.

<code-tabs>
  <code-pane
    header="paginator.component.ts"
    path="component-store-paginator-service/src/app/paginator.component.ts"
    region="selectors"
    >
  </code-pane>
  <code-pane
    header="paginator.store.ts"
    path="component-store-paginator-service/src/app/paginator.store.ts"
    region="selectors">
  </code-pane>
</code-tabs>

<div class="alert is-helpful">

`page$` would emit `PageEvent` when page size or page index changes, however in some cases updater would update both of these properties at the same time. To avoid "intermediary" emissions, `page$` selector is using **`{debounce: true}`** configuration. This schedules a microtask, which allows the state to "settle", meaning all the synchronous changes to happen, and then it would emit a value. All of this happens before Angular's Change Detection runs. More about debouncing can be found in [selector section](guide/component-store/read#debounce-selectors).

</div>

### Local UI State patterns

Components that use `ComponentStore` for managing **Local UI State** are frequently calling `updater`s directly.

Effects can be also called when:
* side effects are required (e.g. `event.stopPropagation()`)
* derived data (from selectors) is needed to influence the new state
* they are orchestrating a number of well-defined updaters

The last point sometimes could be refactored into `updater`. Use your best judgement.

`@Output()`s and derived data are **reacting** on these state changes and are generated with `selector`s.

*ViewModel* for the component is collected with `selector` as well.

## Use Case 2: Complex Common Component State

## Use Case 3: Complex Independent Component Store

## Use Case 4: Application-wide Singleton Service

