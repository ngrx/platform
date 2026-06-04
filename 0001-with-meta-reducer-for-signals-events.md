# RFC: `withMetaReducer` and Signal Store DevTools

**Status:** Draft  
**Updated:** 2026-06-04 (flat `reduce(event, state, next)`; DevTools show actions without apply)  
**Packages:** `@ngrx/signals/events` (meta-reducer), `@ngrx/signals/devtools` (DevTools — later, on top of this RFC)

**Related:** [`withReducer`](../../modules/signals/events/src/with-reducer.ts), [`ReducerEvents`](../../modules/signals/events/src/events-service.ts), [`@ngrx/store-devtools`](../../modules/store-devtools/src/devtools.ts)

## What we want

1. **`withMetaReducer`** — one wrapper per concern around event-driven updates. Meta **`reduce(event, state, next)`** runs code before **`next`**, calls **`next(event, state)`** at most once, then runs code after **`next` returns**. **`next`** runs the matching **`on(...)`** handler and calls **`patchState`** when there is an update. Meta **`reduce`** returns **`void`** — apply happens inside **`next`**, not via a return value.
2. **Official DevTools in `@ngrx/signals/devtools`** — **`withDevtools()`** always uses **[`watchState`](../../modules/signals/src/state-source.ts)** internally (no separate glitch-tracking modifier). Optional **`withEvents()`** enqueues action names in meta **`reduce`** before calling **`next`**.
3. **DevTools timeline** — every dispatched event with **`withEvents()`** appears as a named action, including when the reducer returns no update (empty state diff). Each synchronous **`patchState`** is its own step via **`watchState`** (never coalesced). When there is no apply, DevTools send explicitly after **`next`** (see Phase 2). Queue length **> 1** at **`watchState`** → **`console.error`**, not throw.

Phases: **1** = `withMetaReducer` in events. **2** = DevTools in `@ngrx/signals/devtools`. Toolkit **`withTrackedReducer`** goes away long term.

---

## Layering

```text
@ngrx/signals/devtools ← withDevtools (Redux extension, time travel, …)
        ↓ uses
@ngrx/signals/events   ← withReducer, withMetaReducer — no DevTools imports
        ↓ uses
@ngrx/signals          ← signalStore, withState, patchState, …
```

Events owns the **inner `next`** (handlers + **`patchState`**). User metas call **`next`**; they must not call **`patchState`** themselves. DevTools enqueue before **`next`**, send from **`watchState`** when **`patchState`** runs, or send explicitly after **`next`** when there was no apply. Events package stays unaware of DevTools.

---

## Why `withMetaReducer`?

Today each `on(...)` is wired separately. Cross-cutting logic is copy-pasted or missing.

One meta per concern. **DevTools are a consumer** of the same API (**`reduce(event, state, next)`**), not a special case inside the events package.

---

## Use case

```ts
const BookStore = signalStore(
  withState({ books: [] as Book[], sliceLabel: 'books' }),
  withReducer(
    on(load, (e) => ({ books: e.payload })),
    on(clear, () => ({ books: [] })),
  ),
  withMetaReducer((store) => (event, state, next) => {
    console.log('[Books]', store.sliceLabel(), 'before', event.type, state);

    next(event, state);
    // next runs matching on(...) handler and patchState when there is an update

    console.log('[Books]', store.sliceLabel(), 'after', event.type, getState(store));
  }),
);
```

Stacked metas unwind like HTTP middleware — outer **before** first, inner **before** next, inner **after** `next` returns, outer **after** last:

```text
outer before
  inner before
    handlers → patchState
  inner after
outer after
```

---

## Phase 1: `withMetaReducer` (`@ngrx/signals/events`)

### Factory shape

```ts
type EventMetaReducer<State extends object> = (
  event: unknown,
  state: State,
  next: (event: unknown, state: State) => void
) => void;

type EventMetaFactory<Input extends SignalStoreFeatureResult> = (
  store: Prettify<StateSignals<Input['state']> & Input['props'] & Input['methods'] & WritableStateSource<Input['state']>>
) => {
  /** Call next(event, state) at most once. Returns void. Must not call patchState. */
  reduce: EventMetaReducer<Input['state']>;
};

withMetaReducer<Input>(factory): SignalStoreFeature<Input, EmptyFeatureResult>;
```

**Store typing** matches **`withMethods`** / **`withEventHandlers`**: the factory receives the full store inferred from prior features. An optional explicit generic is available when needed.

**`on(...)` is unchanged** — case reducers still return partials, updaters, arrays, or nothing ([`case-reducer.ts`](../../modules/signals/events/src/case-reducer.ts)). Only the **inner `next`** (built by the events package) turns those into **`patchState`**.

Unlike `@ngrx/store` meta-reducers, user metas **do not return state** — they call **`next`** for side effects (logging, DevTools enqueue, guards). Apply is not driven by a return value.

**Sugar:** a factory that returns `(event, state, next) => { ... }` directly is shorthand for `{ reduce: fn }`.

### What `next` does (events-owned, innermost)

The events package builds the **core `next`** that sits at the bottom of the compose chain:

```ts
// @internal — events package
function createCoreNext<State extends object>(
  store: WritableStateSource<State>,
  caseReducer: CaseReducerResult<State, EventCreator<string, any>[]>
): (event: unknown, state: State) => void {
  return (event, state) => {
    const result = caseReducer.reducer(event, state);
    const updaters = Array.isArray(result) ? result : [result];
    if (isNoUpdate(updaters)) {
      return; // no patchState, no watchState from this step
    }

    patchState(store, ...normalize(updaters));
  };
}
```

User metas receive a composed **`next`** that already includes downstream metas and this core. Calling **`next(event, state)`** runs the full inner chain and apply. Each **`on(...)`** subscription builds its own core **`next`** for that case reducer only (see **Per-`on()` subscriptions** below).

### Meta reducer registry

Metas are collected in a **private meta reducer registry** (not a public API, not an Angular `InjectionToken`). Use a **`WeakMap`** keyed by the **store instance** passed into features — the same object **`withReducer`** / **`withMetaReducer`** already hold (no need to read **`STATE_SOURCE`** for the registry).

Registration is **not** done during feature composition. Feature functions can nest (`signalStoreFeature`, `withFeature`); **`onInit` runs once** when the store is ready. **`EventMetaFactory(store)`** should see the **complete** store (state, props, methods from all features).

**Feature order for factory completeness:** place **`withMetaReducer`** after features whose members the factory needs ( **`withHooks`** captures store members at composition time).

#### Lifecycle

```text
Feature composition (sync, once per store instance)
  withReducer        → create registry; subscribe to ReducerEvents.on(...)
  withMetaReducer    → register onInit only (no registry write yet)
  withDevtools(...)  → same as withMetaReducer (via withEvents())

onInit (once, after all features composed)
  withMetaReducer    → meta = factory(store); append meta to registry

Each matching dispatched event (per on(...) subscription)
  withReducer tap → runEventPipeline(store, event, thatCaseReducer) → compose metas → (event, before)
```

```ts
// withReducer — feature composition (one subscription per on(...), unchanged from today)
(store) => {
  getMetaRegistry(store) ??= [];
  caseReducers.map((caseReducer) =>
    events.on(...caseReducer.events).pipe(
      tap((event) => runEventPipeline(store, event, caseReducer))
    )
  );
  return store;
};

// withMetaReducer — feature composition + onInit
withHooks({
  onInit(store) {
    const registry = getMetaRegistry(store);
    if (!registry) {
      if (ngDevMode) {
        console.error(
          '@ngrx/signals/events: withMetaReducer requires withReducer on the same store. Meta was not registered.'
        );
      }
      return;
    }
    const meta = factory(store);
    registry.push(meta);
  },
});
```

- **`withReducer`** — creates the registry during composition (**`??= []`**); one **`events.on(...)`** subscription per **`on(...)`**; runs **`runEventPipeline`** in each tap (not in `onInit`).
- **`withMetaReducer`** — registers **`onInit` only**; appends a resolved meta when the registry exists.
- **`withDevtools(..., withEvents())`** — registers its meta on the same registry (no second hook system).
- **Multiple `withReducer` features** on one store are allowed; **`ngDevMode`** logs **`console.error`** when more than one **`withReducer`** is composed on the same store (unusual but valid). All share one meta registry.

**Feature order:** **`withDevtools` / `withMetaReducer` may appear before or after `withReducer`**, as long as **`withReducer` is present** for metas to run. The registry is created during **`withReducer`** composition before any **`onInit`**; metas append in **`onInit`** order.

**`withMetaReducer` without `withReducer`:** **`ngDevMode` `console.error`**, meta **not** registered, store keeps working (logging/DevTools must not tear down the SignalStore).

### Pipeline (who calls what)

**`withReducer`** subscribes to `ReducerEvents`. On a matching event:

```text
1. before = untracked(() => getState(store))
2. coreNext = createCoreNext(store, caseReducer)   ← this on(...) only
3. run = composeMetaReducers(metas, coreNext)      ← first registered meta = outermost
4. run(event, before)   ← store updated when inner next ran patchState
```

**Who calls this?** The **events** package inside each **`withReducer` `on(...)`** `tap` handler — when `Dispatcher.dispatch` matches that case reducer. **Not** in **`onInit`**. **Not** DevTools. **Not** the user.

Two **`on(...)`** handlers for the **same** event type each get their own subscription → **two** pipeline runs and **two** applies (existing behavior; see [`with-reducer.spec.ts`](../../modules/signals/events/spec/with-reducer.spec.ts)).

```ts
// events package — no DevTools imports; one call per matching on(...) subscription
function runEventPipeline(store, event, caseReducer) {
  const metas = getMetaRegistry(store) ?? [];
  const before = untracked(() => getState(store));
  const coreNext = createCoreNext(store, caseReducer);
  const run = composeMetaReducers(metas, coreNext);

  run(event, before);
}
```

Meta **`reduce`** and **`next`** both return **`void`**. The store is updated inside core **`next`** only. For “after” logging, call **`getState(store)`** after **`next`**.

### Compose order (middleware and `@ngrx/store`)

**Registry order** matches [`@ngrx/store` meta-reducers](../../modules/store/src/utils.ts): first entry registered in **`onInit`** is **outermost** (runs its before-hook first, after-hook last).

For event metas registered `[A, B, C]`, compose builds a single runner that calls each flat **`reduce(event, state, next)`** with a wrapped **`next`**:

```ts
// @internal — conceptual; outer meta A, inner metas B, C, then coreNext
function composeMetaReducers(metas, coreNext) {
  let next = coreNext;
  for (let i = metas.length - 1; i >= 0; i--) {
    const meta = metas[i];
    const inner = next;
    next = (event, state) => {
      let called = false;
      const guardedNext = (e, s) => {
        if (called) {
          if (ngDevMode) {
            console.error(
              '@ngrx/signals/events: next(event, state) was called more than once in a meta reduce. ' +
                'Multiple runs are not allowed; the second call was dropped.'
            );
          }
          return;
        }
        called = true;
        inner(e, s);
      };
      meta.reduce(event, state, guardedNext);
    };
  }
  return next;
}
```

| | Order (registry `[A, B, …]`) |
|--|------------------------------|
| **before `next`** | A → B → … → handler (outer → inner) |
| **`patchState`** | inside core `next` only (per subscription) |
| **after `next` returns** | … → B → A (inner → outer) |

**Rules:**

- Call **`next(event, state)` at most once** per meta per pipeline run. A second call is **dropped**; **`ngDevMode` `console.error`** explains that multiple runs are not allowed.
- Calling **`next` zero times** short-circuits the update (guard pattern).
- DevTools **enqueue before `next`**; **`watchState`** sends when **`patchState`** runs; if there was no apply, send after **`next`** (see Phase 2).

**Feature list → registry:** earlier **`withMetaReducer` / `withDevtools`** features register first in **`onInit`** → outermost meta.

### Per-`on()` subscriptions

**`withReducer` keeps one `events.on(...)` subscription per `on(...)`** (same as today). **`runEventPipeline`** runs once per subscription with **that** case reducer only. Metas run on every pipeline invocation — so two **`on(...)`** handlers for the same event each run the full meta stack and may each **`patchState`**.

### When does it run?

Only when this store has an **`on(...)`** for that event. Metas do not subscribe to events themselves — they participate in the pipeline **`withReducer`** runs.

### `isNoUpdate`

Define explicitly for the core **`next`**: **`undefined`**, empty array **`[]`**, empty partial **`{}`**, and partial state updaters that resolve to an empty partial — document the exact predicate in implementation. When true, core **`next`** returns early and skips **`patchState`** (no **`watchState`** from that step).

The events package sets a **per-run pipeline flag** when **`patchState`** runs during **`runEventPipeline`**. DevTools use it to choose the send path:

- **Patched:** dequeue via **`watchState`** during apply (queue length 0 or 1).
- **Not patched:** still **show the action** in DevTools (empty state diff) — send explicitly after **`next`** with the queued action and current state; do **not** silently drop the timeline entry.

**`patchState` inside `on(...)` reducers** is not supported — no detection or special handling; behavior is undefined if users call it anyway.

---

## Phase 2: DevTools (`@ngrx/signals/devtools`)

DevTools live in **`@ngrx/signals/devtools`** — a dedicated package, parallel to **`@ngrx/signals/events`**. They **depend on** events when opted in; events does **not** depend on DevTools.

### How DevTools hook in

**`withDevtools(name, …features)`** registers the store with **`DevtoolsSyncer`**, starts **`watchState`** in **`onInit`**, and optionally composes modifiers (**`withEvents()`**, **`withMapper()`**, …).

```ts
import { signalStore, withState } from '@ngrx/signals';
import { on, withReducer } from '@ngrx/signals/events';
import { withDevtools, withEvents, withMapper } from '@ngrx/signals/devtools';

signalStore(
  withState(...),
  withReducer(on(...)),
  withDevtools(
    'book-store',
    withEvents(),
    withMapper((state) => ({ ...state, token: '***' })),
  ),
);

// no events — watchState only
signalStore(withState(...), withDevtools('settings'));
```

**`withEvents()`** registers a DevTools meta (via **`withMetaReducer`**) that enqueues **`event.type`** before **`next`**. User reducers stay in **`withReducer(on(...))`**.

There is **no `withGlitchTracking()`** — sync tracking is **implicit** in **`withDevtools`** (always **`watchState`**, never **`effect`** coalescing).

### Action queue + `watchState` (single send path)

**Fully rely on [`watchState`](../../modules/signals/src/state-source.ts)** for DevTools — **events and plain `patchState`**. One send path keeps implementation simple: every **`patchState`** → **`notifyWatchers`** → send **one** extension message; synchronous updates in the same tick are **never merged**.

Inspired by [NgRx Toolkit DevTools](https://ngrx-toolkit.angulararchitects.io/docs/with-devtools), but **always sync** (see **Difference from toolkit** below).

```text
before next:   push action onto per-store queue (withEvents, updateState, …)
next():        patchState? → notifyWatchers → send from watchState
after next:    if no patchState in this run → send action anyway (empty diff)
```

```ts
// @ngrx/signals/devtools — conceptual
const devtoolsActionQueues = new WeakMap<object, DevtoolsAction[]>();

function enqueueDevtoolsAction(store, action: DevtoolsAction): void {
  const queue = devtoolsActionQueues.get(store) ?? [];
  queue.push(action);
  devtoolsActionQueues.set(store, queue);
}

withMetaReducer((store) => ({
  reduce(event, state, next) {
    enqueueDevtoolsAction(store, { type: event.type, payload: event.payload });
    next(event, state);
    if (!wasPatchedInCurrentPipelineRun(store)) {
      sendDevtoolsFromQueue(store); // named action, unchanged state, empty diff
    }
  },
}));

// withDevtools — onInit; watchState runs synchronously inside each patchState
watchState(store, (state) => {
  const queue = devtoolsActionQueues.get(store) ?? [];
  if (queue.length > 1) {
    console.error(
      '@ngrx/signals/devtools: nested event dispatch during reducer is not supported — ' +
        'multiple actions queued for a single patchState. ' +
        'Do not dispatch from inside on(...) reducers or meta reduce.'
    );
    queue.splice(1); // keep first; drop extras before send
  }
  const action =
    queue.shift() ?? { type: '@ngrx/signals/devtools/update' };
  syncer.syncToDevTools(id, action, state);
});
```

#### Queue rules (each `patchState`)

| Queue length when `watchState` runs | Meaning | Behavior |
|-------------------------------------|---------|----------|
| **0** | Plain **`patchState`** (no name queued) | Generic action `@ngrx/signals/devtools/update` |
| **1** | One named action for this apply | Send it, dequeue |
| **>1** | Nested sync **`dispatch`** during **`reduce`** (or bug) | **`console.error`**; keep first queued action, drop extras, then send |

Each **`updateState(store, name, updaters)`** call **pushes one action**, then **`patchState`** once → **one** DevTools step. A named update is **not** merged with other synchronous applies before or after it.

| Piece | Role |
|-------|------|
| **`withDevtools()`** | **`watchState`** in **`onInit`** (implicit) — **only** extension send path |
| **`withEvents()`** | Meta **`reduce`**: enqueue before **`next`**; send on apply via **`watchState`**, or send after **`next`** when no apply (action visible, empty diff) |
| **`updateState(store, name, updaters)`** | Enqueue `{ type: name }`, then **`patchState`** |
| **`withMapper(fn)`** | Map state before send (e.g. redact secrets) — template: toolkit |

No second hook system. DevTools use the same meta API as everything else.

### Difference from NgRx Toolkit DevTools

| | **Toolkit** | **Official `@ngrx/signals/devtools`** |
|---|-------------|--------------------------------------|
| **Glitch-free vs glitched** | Optional **`withGlitchTracking()`**; default can coalesce ( **`effect`** ) | **`watchState` built into `withDevtools`** — no separate modifier |
| **Events** | **`withTrackedReducer`** + **`withGlitchTracking()`** | **`withEvents()`** + **`withReducer`** |
| **Pending actions** | **`currentActionNames`** `Set` + effect flush | **Per-store action queue** on each **`patchState`** |
| **Nested `dispatch` in reducer** | Implicit assumption | **Queue length > 1 → `console.error`** |
| **Many stores** | **`DevtoolsSyncer`**: one extension connection; merged state keyed by store name | Same model (see **Many stores** below) |
| **Sync burst** | Opt-in glitch tracking | **Always** one DevTools step per **`patchState`**; named actions not merged across applies |

Toolkit users migrate **`withTrackedReducer`** + **`withGlitchTracking()`** → **`withReducer`** + **`withDevtools('name', withEvents())`**. Drop **`withGlitchTracking`** — it is implicit in official **`withDevtools`**.

**Implementation note:** For areas that match this RFC, use [NgRx Toolkit DevTools](https://github.com/angular-architects/ngrx-toolkit/tree/main/libs/ngrx-toolkit/src/lib/devtools) as a **template** — **`DevtoolsSyncer`**, store registration, name indexing, **`renameDevtoolsName`**, **`provideDevtoolsConfig`**, **`withMapper`**, tree-shaking stub. Replace **`DefaultTracker`** / **`GlitchTracker`** / **`currentActionNames`** with **built-in `watchState` + per-store action queue**; wire **`withEvents()`** via meta **`reduce`** instead of **`withTrackedReducer`**. Add **time travel** and **dispatch from extension** (see **`@ngrx/store-devtools`** + extension `connect` options).

### Many stores

**Decision:** **one Redux DevTools connection**, **keyed substates** — same as toolkit and `@ngrx/store` feature keys. **Not** one connection per signal store.

Toolkit implements this with root **`DevtoolsSyncer`** ([`devtools-syncer.service.ts`](https://github.com/angular-architects/ngrx-toolkit/blob/main/libs/ngrx-toolkit/src/lib/devtools/internal/devtools-syncer.service.ts)):

```text
provideDevtoolsConfig({ name: 'My App' })   ← optional; default "NgRx SignalStore"
        ↓
DevtoolsSyncer (providedIn: 'root')
  · one __REDUX_DEVTOOLS_EXTENSION__.connect(...)
  · #stores: internal id → { displayName, options }
  · #currentState: { [displayName]: state }   ← merged tree sent to extension
        ↓
withDevtools('book-store') onInit → addStore(id, 'book-store', store, …)
withDevtools('cart-store') onInit → addStore(id, 'cart-store', store, …)
        ↓
watchState / tracker → syncToDevTools({ [id]: changedSlice })
  → map id → displayName, merge into #currentState
  → connection.send({ type: actionFromQueue }, #currentState)
onDestroy → removeStore(id)   ← drop slice from registry and #currentState
```

**`withDevtools('book-store')`** — the string is the **feature key** (slice name in DevTools), like `StoreModule.forFeature('books', …)`.

**Multiple instances** of the same store class:

| Behavior | API |
|----------|-----|
| Auto-index (`book-store`, `book-store-1`, …) | default |
| Forbid duplicates | **`withDisabledNameIndices()`** (toolkit name) — throw if name taken |
| Runtime rename | **`renameDevtoolsName(store, 'book-' + id)`** |

Official package should expose the same ergonomics where this RFC matches toolkit (names may live under `@ngrx/signals/devtools`).

Each store runs **`watchState`** from **`withDevtools`**; only **`DevtoolsSyncer`** calls **`connection.send`** with the **merged** `#currentState`. Action names come from the **per-store action queue**.

### Phase 2 feature set

In scope for **`@ngrx/signals/devtools`** (not deferred):

| Feature | Notes |
|---------|--------|
| **`watchState` tracking** | Implicit in every **`withDevtools`** — no **`withGlitchTracking`** export |
| **`withEvents()`** | Event names via meta **`reduce`** + action queue |
| **`updateState()`** | Named non-event updates |
| **`withMapper(fn)`** | Redact / transform state before send (toolkit template) |
| **Time travel** | Extension jump / lock — align with [`@ngrx/store-devtools`](../../modules/store-devtools/src/config.ts) |
| **Dispatch from extension** | Handle extension-initiated actions (connection callbacks) |
| **Tree-shaking** | **`withDevtoolsStub`** no-op + environment replacement (toolkit pattern) so prod bundles drop DevTools |
| **`provideDevtoolsConfig`**, **`renameDevtoolsName`**, name indexing | Same as toolkit where applicable |

### Main path: events + `withReducer`

Synchronous: meta **`reduce`** (enqueue before **`next`**) → **`next()`** (handler + optional **`patchState`**) → **`watchState`** send when patched, or **explicit send** after **`next`** when not patched (action still shown).

### Also: `patchState` outside events

Same **`watchState`** path. **`updateState(store, 'action name', updaters)`** enqueues a name; plain **`patchState`** uses the generic action when the queue is empty.

### Toolkit

Deprecate **`withTrackedReducer`** when official **`withDevtools`** ships. Migration:

```ts
// toolkit
withDevtools('books', withGlitchTracking()),
withTrackedReducer(on(...)),

// official
withDevtools('books', withEvents()),
withReducer(on(...)),
```

### Tree-shaking (production)

Same pattern as [toolkit](https://ngrx-toolkit.angulararchitects.io/docs/with-devtools#disabling-devtools-in-production): export **`withDevtoolsStub`** (no-op feature), swap via environment / file replacement so **`withDevtools`** is not bundled in production when disabled.

```ts
// environment.ts
export const environment = { withDevtools };

// environment.prod.ts
export const environment = { withDevtools: withDevtoolsStub };
```

---

## What phase 1 does not ship

- Any **`@ngrx/signals/devtools`** code (phase 2).

---

## Decisions

- **Flat `reduce(event, state, next)`:** one function per meta; not curried **`(next) => (event, state)`**. Shorthand **`(store) => (event, state, next) => …`** or **`{ reduce }`**. Store typing inferred like **`withMethods`**.
- **`next` model:** **`next(event, state)`** runs downstream metas and core handler; **`patchState`** only in core **`next`**. **`reduce`** and **`next`** return **`void`**. Use **`getState(store)`** after **`next`** for the real snapshot.
- **Meta returns void:** unlike `@ngrx/store` meta-reducers, user metas do not return state.
- **`on(...)` unchanged:** case reducers still return partials/updaters; only core **`next`** applies them.
- **Meta reducer registry:** **`WeakMap`** keyed by **store instance**. **`withReducer`** creates **`??= []`** during composition; **`withMetaReducer`** appends in **`onInit`** only when registry exists.
- **`withMetaReducer` without `withReducer`:** **`ngDevMode` `console.error`**, meta not registered, store must not throw.
- **Why `onInit` for registration:** composition is not a guaranteed once-only init boundary; **`EventMetaFactory(store)`** needs the full store.
- **Per-`on()` subscriptions:** one **`events.on(...)`** per **`on(...)`**; **`runEventPipeline(store, event, caseReducer)`** per tap; same-event multi-**`on()`** keeps two applies (existing behavior).
- **Multiple `withReducer` on one store:** allowed; **`ngDevMode` `console.error`** when more than one; shared meta registry.
- **User meta must not call `patchState`:** apply stays in core **`next`** only.
- **`patchState` inside `on(...)` reducers:** unsupported; no special handling.
- **`next` at most once per meta:** second call dropped; **`ngDevMode` `console.error`** (multiple runs not allowed).
- **`reduce` compose order:** first registered in **`onInit`** = outermost (same ordering intent as `@ngrx/store`).
- **`isNoUpdate`:** **`undefined`**, **`[]`**, **`{}`**, empty updater result → skip **`patchState`**.
- **DevTools and no-op events:** always show the queued action; send via **`watchState`** when patched, **explicit send after `next`** when not patched (empty diff).
- **DevTools otherwise:** **`watchState`** in **`withDevtools`**; per-store queue keyed by store instance; one message per **`patchState`**; enqueue before **`next`**; not **`effect`**.
- **Queue length > 1 at `watchState`:** **`console.error`** (nested sync **`dispatch`**); keep first action, drop extras.
- **No `withGlitchTracking` modifier:** sync tracking is implicit in **`withDevtools`**.
- **Phase 2 in scope:** time travel, dispatch from extension, **`withMapper`**, tree-shaking (**`withDevtoolsStub`**).
- **`updateState(store, name, updaters)`** in **`@ngrx/signals/devtools`** — enqueue one action per call; toolkit migration.
- **Many stores:** one extension connection via root **`DevtoolsSyncer`**; merged state keyed by **`withDevtools(name)`**; auto-index duplicate names; **`renameDevtoolsName`**; optional **`provideDevtoolsConfig`**. Align with [toolkit `DevtoolsSyncer`](https://github.com/angular-architects/ngrx-toolkit/blob/main/libs/ngrx-toolkit/src/lib/devtools/internal/devtools-syncer.service.ts).

## Open questions

Resolved in review (2026-06-04) — see **Decisions** above. No remaining open items.

---

## Tasks after acceptance

**Phase 1 — events (no DevTools code)**

- [ ] Private **meta reducer registry** (`WeakMap` keyed by store instance).
- [ ] **`createCoreNext`:** run one case reducer → **`patchState`** or skip when **`isNoUpdate`**; per-run patched flag.
- [ ] **`withReducer`:** registry in composition; one subscription per **`on(...)`**; **`runEventPipeline`** per tap; **`ngDevMode` error** when multiple **`withReducer`** on same store.
- [ ] **`withMetaReducer`:** flat **`reduce(event, state, next)`**; register in **`onInit`**; inferred store typing; shorthand + `{ reduce }`.
- [ ] **`composeMetaReducers`:** first registered = outermost; guard **`next`** (drop second call, **`ngDevMode` `console.error`**).
- [ ] **`ngDevMode` `console.error`** when **`withMetaReducer`** without **`withReducer`** (do not register meta; do not throw).
- [ ] Tests + docs + export (examples: property access on store, flat **`reduce`**).

**Phase 2 — `@ngrx/signals/devtools`**

- [ ] New package `@ngrx/signals/devtools` (peer: `@ngrx/signals`, optional peer: `@ngrx/signals/events` when using `withEvents()`).
- [ ] `withDevtools` — no DevTools imports in events package.
- [ ] **`withDevtools(name, …)`** — implicit **`watchState`** in **`onInit`**; per-store action queue; **`console.error`** if queue length **> 1**.
- [ ] **`withEvents()`** (enqueue; send on apply or explicit send when no apply), **`withMapper()`**, **`withDisabledNameIndices()`** modifiers.
- [ ] **`updateState()`** — enqueue + **`patchState`**.
- [ ] Root **`DevtoolsSyncer`** (template: toolkit).
- [ ] **`provideDevtoolsConfig`**, **`renameDevtoolsName`**, name indexing.
- [ ] **Time travel** + **dispatch from extension** ( **`@ngrx/store-devtools`** + extension API).
- [ ] **Tree-shaking:** **`withDevtoolsStub`**, environment swap pattern.
- [ ] Document **Difference from toolkit** and implementation template.
- [ ] Migration from toolkit **`withTrackedReducer`** / **`withGlitchTracking`**.

**Toolkit**

- [ ] Deprecate `withTrackedReducer`.

---

## Alternatives we did not pick

- DevTools only in toolkit.
- Collecting metas only “next to” **`withReducer`** (feature-order / sibling scanning) instead of a **private meta reducer registry**.
- Registering metas during **feature composition** instead of **`onInit`** — rejected; composition is not a guaranteed once-only init boundary and the store may be incomplete.
- **Separate `afterApply` hook** — rejected; code after **`next()`** in **`reduce`** is enough.
- **Curried `(next) => (event, state)` meta API** — rejected; flat **`(event, state, next)`** for simpler docs and usage.
- **Meta returns state (Redux-style)** — rejected; apply happens inside **`next`**; metas return **`void`** and use **`getState(store)`** for post-apply reads.
- **`next` returns updaters, events calls `patchState` outside the chain** — rejected; **`next`** should include apply.
- **`effect` + `getState` for DevTools** — rejected; glitch-free coalescing hides synchronous multi-update bursts.
- **Toolkit-style glitch-free DevTools mode** (collect + **`effect`**) — rejected; always **`watchState`**, one step per **`patchState`**.
- **DevTools send only inside `patchState` / `watchState`** — rejected for no-op events; action must still appear (explicit send after **`next`** when not patched). When patched, enqueue before **`patchState`** and send from **`watchState`** during apply.
- **Dropping DevTools actions on no-op events (dequeue / pop)** — rejected; timeline must show the event with an empty diff.
- **Separate `withGlitchTracking()` modifier** — rejected; **`watchState` is built into `withDevtools`**.
- **Single pending slot (no queue)** — rejected; queue enables nested-dispatch detection (**length > 1 → `console.error`**) and one action per apply.
- **Merging synchronous DevTools steps** — rejected; each **`patchState`** and each **`updateState()`** is its own timeline entry.
- **One extension connection per signal store** — rejected; use **`DevtoolsSyncer`** + keyed substates (toolkit / `@ngrx/store` model).
- Global `ReducerEvents` listener only — no per-store meta pipeline.
- User meta calls **`patchState`** — rejected; apply stays in core **`next`** only.
