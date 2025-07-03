# NgRx Style Guide

## Introduction

NgRx is a powerful state management library for Angular applications, based on the Redux pattern. It helps coordinate global state, side effects, and reactive data flow in a predictable way. However, without an official style guide, teams often struggle with consistent patterns. This guide aims to provide a set of **best practices and conventions** for using NgRx in modern Angular (latest version) applications. By following these guidelines, you can ensure your NgRx usage is **maintainable, scalable, and clear** for all team members. The tone here is informed by real-world experience – you’ll find practical recommendations with explanations so you understand *why* each guideline exists.

This document covers everything from high-level principles to code-level patterns. It is intended for Angular developers of all levels who want to standardize how they implement NgRx in their projects. The style is professional yet approachable – like a senior developer walking you through what “good NgRx” looks like in practice.

Let’s begin by grounding ourselves in some core principles behind NgRx, and then dive into specific guidelines for structure, naming, implementation, and more.

## Core Principles

Before we get into the nitty-gritty, remember that NgRx builds on a few fundamental **core principles** (inherited from Redux) that inform all the best practices:

- **Single Source of Truth:** The application state is kept in one place – the store. Instead of scattering state across services and components, centralize it in the NgRx store, making it the one definitive source for state. This ensures consistency and easy global access to data.

- **State is Read-Only:** You never modify state variables directly. The only way to evolve state is by dispatching an **action** that describes the change. Reducers then create a new state based on that action. This makes all changes explicit and traceable. You should avoid any direct mutation of state outside reducers – no manual setting of store values.

- **Changes via Pure Functions (Reducers):** Reducers are pure functions with no side effects. Given the previous state and an action, a reducer returns a new state without modifying the old one. This immutability is crucial: by never altering existing state, we avoid unexpected side-effects and make the timeline of state changes predictable (which is great for debugging and undo/redo in DevTools).

- **One-Way Data Flow:** NgRx enforces a unidirectional flow: components dispatch actions → reducers process them and update state → new state emits to components via selectors. This loop means data flows in one direction, preventing spaghetti updates. An implication is that **side effects are isolated** – any asynchronous or impure operation belongs in an Effect (or outside NgRx), not in a reducer. Keeping side effects out of reducers ensures the pure function rule is not violated.

- **Serializability & Purity:** All state in NgRx should be serializable (simple JS objects/arrays/primitives). Do not keep things like open file handles, DOM elements, or other non-serializable references in the store. For example, avoid putting a complex class instance or a callback function in state – if it can’t be reliably cloned or logged, it doesn’t belong. (NgRx’s devtools and time-travel debugging rely on state being serializable.) Similarly, ensure actions are serializable events – they typically carry simple data in their payloads.

- **Traceability and Debugging:** A big advantage of NgRx is the ability to trace *when, why, and how* state changed. Embrace tools like Redux DevTools to inspect dispatched actions and state mutations. Naming actions clearly (we’ll cover this) and following these principles makes debugging much easier, since you can follow the log of events to understand app behavior. Every state change should be attributable to an action – if it isn’t, that’s a code smell (e.g., a service modifying state directly, which should be avoided).

- **Avoid Over-Engineering**: While NgRx is powerful, use it judiciously. Not every piece of data needs to be in the global store. For instance, **local UI state** (like a component’s temporary form input or a toggle) might remain in the component or use a local state management solution. A good rule of thumb is to put data in NgRx store if it’s **shared across multiple parts of the app, needed for synchronization (e.g., via actions), or you want to cache it globally**. Otherwise, keeping it local can be simpler. NgRx is best for global or app-level state; don’t use it for every little thing.

By keeping these core ideas in mind, you’ll naturally write NgRx code that is aligned with the intended patterns of the library. Next, we’ll look at how to organize your project’s folder structure to reflect these principles.

## Folder Structure

A well-defined folder structure makes it easy to locate and manage your NgRx code. Generally, **group your NgRx files by feature** rather than by type. In practice, that means each major feature or domain in your application gets its own folder with all the NgRx pieces (actions, reducer, etc.) for that feature. This scales better than grouping by type (all actions in one folder, all reducers in another, etc.), which tends to become unwieldy in large apps.

**Feature-Based Structure:** A recommended approach is as follows:

- Each feature (or module) lives in a dedicated directory, e.g. `users`, `products`, `orders`, etc., typically under a common `state` or `store` directory (or within the feature module folder itself).

- Inside each feature folder, include separate files for each NgRx component:

  - `feature-name.state.ts` – defines the interface for that feature’s state and its initial state.
  - `feature-name.actions.ts` – all actions related to that feature.
  - `feature-name.reducer.ts` – the reducer function and any helper functions for that state.
  - `feature-name.selectors.ts` – selectors for that state.
  - `feature-name.effects.ts` – any NgRx Effects associated with that feature.
  - (Optionally, if using NgRx Entity, you might have a `feature-name.adapter.ts` for entity adapter setup, or include that in the state file.)

- If your feature is a lazy-loaded Angular module, you’d integrate the NgRx pieces in that module via `StoreModule.forFeature` and `EffectsModule.forFeature`. This way, the feature’s state is added to the global store only when the module is loaded.

For example, your project structure could look like:

```
app/
  core/                (core services and possibly core state)
  store/               (root store setup if applicable)
    app.state.ts       (root state interface)
    app.reducer.ts     (root state combiners)
    app.actions.ts     (perhaps global app-level actions)
  features/
    auth/
      state/           (NgRx state for auth feature)
        auth.state.ts
        auth.actions.ts
        auth.reducer.ts
        auth.selectors.ts
        auth.effects.ts
    products/
      state/
        products.state.ts
        products.actions.ts
        products.reducer.ts
        products.selectors.ts
        products.effects.ts
    ... etc ...
```

Every lazy-loaded feature has its own `state` folder in this scheme, keeping the NgRx logic **encapsulated by feature**. This makes it easier for developers to find all related state management code when working on a feature: you look in one folder instead of hunting through a global actions or reducers directory.

**File Naming:** As seen above, it’s recommended to prefix files with the feature name (e.g., `auth.actions.ts`, `auth.reducer.ts` rather than just `actions.ts` in each folder). This avoids confusion when multiple files are open, and helps with quick searches – you won’t end up with 10 files all named `actions.ts` in your editor and wonder which is which.

**Barrel Files (Index):** Some teams use `index.ts` barrel files to re-export pieces of the state (especially if you have selectors or actions that need to be imported widely). For instance, you might have `auth/index.ts` that exports everything in the `auth/state` subfolder, so consumers can import from `'app/features/auth'` directly. Barrels are optional – they can simplify imports, but they add an indirection. Use them if they make sense for your project structure.

**Root State vs Feature State:** Typically you will have a root store module (set up in `AppModule` or via `provideStore` in Angular’s main config) that combines the feature reducers. For example, in `app.module.ts` (Angular <14) or `app.config.ts` (Angular 16+ with standalone APIs), you import the NgRx modules:

- Angular v15 and below:

```ts
@NgModule({
  imports: [
    StoreModule.forRoot(rootReducers, { runtimeChecks: {/*...*/} }),
    EffectsModule.forRoot([/* root effects if any */]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !prodMode })
  ],
  // ...
})
export class AppModule {}
```

- Angular v16+ (using `provideStore` in a standalone config file):

```ts
// app.config.ts
import { provideStore, provideState, provideEffects } from '@ngrx/store';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './features/auth/state/auth.effects';

export const appConfig = {
  providers: [
    provideStore(),
    provideState('app', appReducer), // if you have a root state key
    provideEffects(AuthEffects)
    // ... plus any feature reducers/effects or use forFeature in lazy modules
  ]
};
```

This approach centralizes store setup in one place, albeit it’s newer syntax. The key point is to register your reducers and effects appropriately, whether using module imports or provider functions.

For each feature module (if lazy-loaded), ensure to call `StoreModule.forFeature('featureKey', featureReducer)` and `EffectsModule.forFeature([FeatureEffects])` in that module’s imports array (or the equivalent `provideState`/`provideEffects` in its configuration). The `'featureKey'` is a unique string key under which that feature’s state will be attached in the global store. It’s often just the feature name in lowercase, or you can maintain a centralized enum of feature keys for consistency (e.g., `Features.User = 'user'`, then use `StoreModule.forFeature(Features.User, userReducer)` to avoid typos).

**Alternative Structures:** In smaller applications, you might put all NgRx files in a single `store/` directory at the root (with subfolders for features or types). This is workable for small teams or simple apps. However, as the app grows, a monolithic store folder becomes hard to maintain. Grouping by feature is generally more scalable. One hybrid approach is to keep a `store/` at root for truly global state (like app-wide settings or user session) and feature-specific state files alongside their feature modules. The key is consistency – pick a structure early and apply it uniformly.

In summary, organize your NgRx code to mirror your app’s feature structure. This makes your codebase intuitive. A new developer should be able to say, “I need to see how product catalog state is handled,” and quickly find a `products` state folder with everything from actions to effects.

## Naming Conventions

Consistency in naming is not just aesthetic – it greatly aids understanding, especially when debugging via NgRx DevTools or reading code. Here are recommended naming conventions for various NgRx elements:

- **State Slices and Feature Keys:** Use descriptive names for your feature state slices. The key you provide to `StoreModule.forFeature` (or the property in the root reducer) should be a succinct noun describing the slice, usually lowercase. For example: `'auth'`, `'products'`, `'cart'`. If you maintain a constants file or enum for feature keys, give it a clear name like `FeatureKey.Auth = 'auth'` etc. The TypeScript interface for that state can be named like `AuthState`, `ProductsState` (i.e., Feature + "State"). This interface defines the shape of that slice. For the overall app state interface, `AppState` or `RootState` is commonly used.

- **Actions:** Define action creators using `createAction`, and name the action types with a **context and an event**. A widely used format is:

  ```
  '[Source] EventName'
  ```

  The *source* (in square brackets) typically is a feature or context, and the event name describes what happened. For example: `'[Auth] Login Success'`, `'[Products Page] Filter Changed'`, `'[Cart API] Add Item Failure'`. The bracketed part helps group actions in DevTools by feature or origin, making logs easier to scan. Use title case or sentence case for the event description (e.g., "Load Users", "Load Users Success").

  The variable name of the action (the constant you export) should be a **verb phrase** in camelCase that describes the event, often similar to the type string but more ergonomic for calling. For instance: `login`, `loginSuccess`, `loginFailure` for the auth login sequence. You might prefix with the entity if needed to avoid collisions, like `loadUsers`, `loadUsersSuccess` if another feature also has a `load`. Some teams use an `[Feature]` prefix in the variable name too (e.g., `authLogin`), but this can be redundant if the file or context already makes it clear.

  **Event vs Command naming:** It’s recommended to name actions as *events that have occurred* rather than commands to do something. For example, prefer `addItem` (implying “the user attempted to add an item”) over `addItemCommand` or `doAddItem`. Similarly, for results, `addItemSuccess` (“the item was successfully added”) is better than something like `itemAdded` if it remains consistent. The idea is each action represents a fact or event in the system, not a direct method invocation. This avoids ambiguity about whether an action is an intention or a result. In practice, many use imperative phrasing for the initial action (e.g., `loadUsers` as the user intent to load) and past tense for outcomes (`usersLoaded` vs `loadUsersSuccess`). Both styles can work; the critical part is consistency and clarity on what the action signifies. As a rule of thumb, **never reuse the same action type for multiple different outcomes or purposes** – each action type should be unique and clearly delineated.

  In code, an example set of actions for an async operation might be:

  ```ts
  export const loadUsers = createAction('[User API] Load Users');

  export const loadUsersSuccess = createAction('[User API] Load Users Success', props<{ users: User[] }>());

  export const loadUsersFailure = createAction('[User API] Load Users Failure', props<{ error: string }>());
  ```

  Here the `[User API]` prefix suggests these actions relate to an API call in the User context. The names and grouping will show up clearly in logs/DevTools.

  Additionally, action creators should be grouped logically. In your `*.actions.ts` file, you might group exports by feature or by the part of the feature. Some developers also define an **Action union type** for all actions in that file (e.g., `type AuthActions = ReturnType<typeof login | typeof loginSuccess | typeof loginFailure>;`). This is optional with the functional `createAction` pattern – it was more common with class-based actions – but can still be useful for reducer switch cases or for testing to have a single type that encompasses all possible actions.

- **Reducers:** The reducer function is usually named after the state or feature. If you have a feature called `products`, you might name the reducer function `productsReducer`. If using `createReducer`, you’ll often define it as a constant: `export const productsReducer = createReducer(...);`. When combining in the root, you could then use `StoreModule.forFeature('products', productsReducer)`. For the root state, often we combine using an object, e.g. `{ [FeatureKey.Auth]: authReducer, [FeatureKey.Products]: productsReducer }`. The key and reducer name naturally correspond. If only one reducer per file, you can also default-export it or just call it `reducer` and import with an alias. The main thing is clarity in usage.

  For the state interface naming (as mentioned), use `SomethingState` for interface, and often `initialSomethingState` or just `initialState` for the initial value. For example:

  ```ts
  export interface ProductsState { ... }

  export const initialProductsState: ProductsState = { ... };
  ```

- **Selectors:** It’s recommended to **prefix selector names with “select”** to indicate their purpose. For example: `selectAllProducts`, `selectCurrentUser`, `selectIsLoading`. This is a convention encouraged by the NgRx community and even lint rules, as it makes it obvious that a function is a selector (and typically returns part of the state). If a selector is just a constant (arrow function) selecting a property, you might name it after that property, e.g. `selectProductEntities`. Derived selectors that compose others can have more descriptive names like `selectFeaturedProducts` or `selectUserProfileData` – but still start with "select".

  One common pattern is:

  - Start with a feature state selector, often named `selectFeatureNameState` (e.g., `selectAuthState`), which uses `createFeatureSelector`.
  - Then define specific selectors for parts of that state: e.g., `selectAuthUser` (from auth state), `selectAuthError`, etc., using `createSelector` with the feature selector as input. If your feature state is nested or complex, you might also have intermediate selectors (e.g., `selectCartItems`, `selectCartTotal`).

  Another style is to use the feature key in the name, like `selectAuth_State` and then `selectAuthUser` – but typically the camelCase already delineates it. The key is to avoid vague names. For instance, a selector just called `isLoaded` is unclear out of context; `selectProductsLoaded` is better.

  The selector name should correspond to what it returns. If it returns a boolean, name it like a boolean (e.g., `selectIsAdmin` returns true/false). If it returns a list, pluralize (e.g., `selectAllOrders`). This makes the code more readable.

- **Effects:** By convention, effect observables are named with a `$` suffix to denote that they are observables (this is a common RxJS convention in Angular). So if you have a login effect, you might define it as `login$ = createEffect(...);`. The name (without the $) often corresponds to the action or the intent it handles. For example, in an AuthEffects class, you might have `login$`, `logout$`, `loadUserProfile$`, etc. If an effect is for an internal or automatically dispatched action, name it clearly (e.g., `initApp$` for an effect that runs on app init).

  If an effect does not dispatch a new action (i.e., just performs a side effect like navigation), you might still name it like `navigateAfterLogin$` or similar, with `$`. Remember to set `dispatch: false` in `createEffect` for such cases (more on that later).

- **Action Constants (optional):** In older NgRx patterns, we defined action type constants in ALL_CAPS with underscores (e.g., `LOAD_USERS_SUCCESS`). If you still use that pattern (some teams like constants for maintaining types), stick to the all-caps convention for the constant strings, and the `[Source] Event` for the value. However, with `createAction`, this is less common – you usually rely on the action creator’s `type` property which is automatically the string. In any case, ensure each action type string is unique across your app. A good practice is including the feature or domain in the string as we described, which inherently makes collisions unlikely.

- **Models & Other Names:** If you differentiate between backend models, store state, and view models, adopt a consistent naming scheme. For instance, you might suffix raw API models with `Dto` (e.g., `UserDto`), use plain names for store state models (e.g., `User` as an interface after transformation), and suffix `Vm` or `View` for view-specific combinations. This isn’t strictly an NgRx concern but helps clarity when selectors assemble view models – you know what each type represents.

In summary, name things for clarity and consistency. When you see an identifier, it should be obvious whether it’s an action (`addItem`, `addItemSuccess`), a selector (`selectItemCount`), a state slice (`CartState`), or an effect (`checkout$`). Adhering to these naming conventions will make your code self-documenting and easier to follow.

## Creating Actions

Defining actions is the first step in the NgRx cycle – they represent the events that trigger state changes or side effects. Here’s how to create actions effectively:

- **Use `createAction`:** The modern NgRx API provides the `createAction` function which makes action creation straightforward. You should use it instead of the older class-based actions because it reduces boilerplate. For example:

  ```ts
  // file: auth.actions.ts
  import { createAction, props } from '@ngrx/store';

  export const login = createAction(
    '[Auth Page] Login',
    props<{ credentials: { email: string; password: string } }>()
  );

  export const loginSuccess = createAction(
    '[Auth API] Login Success',
    props<{ user: User }>()
  );

  export const loginFailure = createAction(
    '[Auth API] Login Failure',
    props<{ error: string }>()
  );
  ```

  In this snippet, we define three actions for a login flow. The `login` action might be dispatched when a user submits a login form (notice the source is "Auth Page", indicating a user interaction). The `loginSuccess` and `loginFailure` actions are dispatched by an effect after an API call, with "Auth API" as the source in the type string. Each action carries the necessary data in a strongly-typed way via `props`.

  This pattern of `<doSomething>, <doSomething>Success, <doSomething>Failure` is very common for asynchronous operations and is recommended for clarity. It clearly separates the request initiation from the outcomes.

- **Action Payloads (Props):** Include in the action’s props only the data needed for that event. For example, the `login` action carries user credentials needed to attempt login. The `loginSuccess` carries the resulting user info, and `loginFailure` carries an error message or object. Keeping payload minimal (and serializable) is good practice. If an action doesn’t need additional data (like a simple trigger action), you can omit `props<>()` altogether (as with `login` above, if perhaps credentials were gathered elsewhere; but in our example we did include credentials to pass them to effect).

- **Descriptive Action Types:** We touched on naming, but to reinforce – make action type strings descriptive. In DevTools, when you see an action like `[Cart] Add Item` vs just `ADD_ITEM`, it’s much more informative. The bracket prefix groups it and the phrase explains what happened. Imagine debugging: you want to know if an item was added to the cart and whether it succeeded – with well-named actions, the log might read: `[Cart] Add Item`, then `[Cart API] Add Item Success` or `[Cart API] Add Item Failure`. This tells the story of what happened in the app in a human-readable way. Always think of the action log as a narrative of user and system events.

- **Organizing Actions:** It’s recommended to keep related actions together. Typically, one file per feature is used. Within that file, you might further group actions by context (for example, actions related to loading vs updating, or UI events vs API events). You can use comments or sections to separate them. Some teams prefix action constants with a category (like `LoginPage_Login` vs `AuthApi_LoginSuccess` function names), but if you use the bracket naming in the type, that may suffice. The key is when someone opens the actions file, they see all the possible actions in that domain at a glance.

- **Avoid Too Many Tiny Actions:** Each action should represent a distinct, meaningful event. It can be tempting to create actions for every minor thing (“set input field X”, “set input field Y”) – but if those changes are truly local and don’t need global store, they might not warrant actions. Also, if you find yourself dispatching multiple actions in a row to accomplish one thing frequently, consider if that sequence could be collapsed (for example, one action carries more data and the reducer updates multiple state properties). Over-dispatching can lead to unnecessary renders and complexity. Aim for a balance: granular enough to describe events, but not so granular that you’re dispatching a flurry of actions for one user interaction.

- **Unique Action Types:** Ensure each action’s type string is unique across the entire app. If two `createAction` calls use the same string, they will be treated as the same action type by the store (which can lead to unintended behavior). The feature prefix in the string usually prevents this (two different features can have a `Load Data` action, but as long as one is `[FeatureA] Load Data` and the other is `[FeatureB] Load Data`, they are different). If you accidentally duplicate the exact string, NgRx will not warn you, so be careful with copy-paste. Using a consistent prefix strategy and possibly an enumeration of action type constants can help avoid collisions (where the enum values incorporate the feature name).

- **Flux Standard Actions (FSA):** NgRx actions generally follow the Flux Standard Action convention (type, payload, etc.). `createAction` with `props` essentially sets up the action to have a payload. You don’t need to strictly enforce an `error` or `meta` field as FSA suggests, but do try to have a consistent shape for similar actions. For instance, success actions usually carry the data obtained, failure actions carry an error, etc. This makes handling them in reducers/effects easier and more predictable.

- **Example of an Action Factory (Advanced):** If you have many actions that follow a repetitive pattern, you can abstract them. For example, you might create a utility that generates the trio of load/success/failure actions given a base name. However, use such abstractions carefully – while they reduce boilerplate, they can hide the explicitness of action definitions. When starting out, it’s perfectly fine (even preferable) to write them out by hand for clarity. Optimize later if needed.

Creating good actions sets the stage for the rest of the NgRx cycle. Think of actions as the vocabulary of events in your application – define them clearly and your state management code will be easier to follow.

## Writing Reducers

Reducers are the heart of state management in NgRx. They take the current state and an action, and produce a new state. Here’s how to write reducers that are clean, correct, and maintainable:

- **Use `createReducer` and `on`:** Instead of writing massive switch-case statements, prefer NgRx’s `createReducer` function. It makes it easier to handle multiple actions and splits logic into smaller functions. For example:

  ```ts
  // file: auth.reducer.ts
  import { createReducer, on } from '@ngrx/store';
  import * as AuthActions from './auth.actions';
  import { AuthState, initialAuthState } from './auth.state';

  export const authReducer = createReducer(
    initialAuthState,

    on(AuthActions.login, state => ({
      ...state,
      loading: true,
      error: null  // clear previous errors
    })),

    on(AuthActions.loginSuccess, (state, { user }) => ({
      ...state,
      loading: false,
      isAuthenticated: true,
      user: user
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: error
    })),

    on(AuthActions.logout, state => ({
      ...state,
      isAuthenticated: false,
      user: null
    }))
  );
  ```

  In this example, each `on` corresponds to an action and defines how the state changes in response. We start from an `initialAuthState` and on a `login` action we set loading true, on success we fill user data, etc. This is much cleaner than a switch-case, and it naturally avoids forgetting a `break` statement or similar errors.

- **Immutability – Never Mutate State:** This cannot be stressed enough: **do not mutate the state object or its nested properties** in a reducer. Always return a new object/array. In the above example, we used the spread operator (`...state`) to copy existing state and then override specific fields. For arrays, use methods like `concat`, `slice`, or the spread operator to produce new arrays instead of pushing/splicing. For example, to add an item to an array in state:

  ```ts
  // BAD (mutation)
  state.items.push(newItem);
  return state;

  // GOOD (immutability)
  return {
    ...state,
    items: [...state.items, newItem]
  };
  ```

  By keeping state changes immutable, you ensure that change detection and selector memoization work correctly. Mutating state can lead to bugs that are hard to trace (the state changes but since it’s the same object reference, observers might not detect the change, and DevTools time-travel becomes impossible). In fact, one of the listed top mistakes is “Mutating the store data” – it violates the core Redux principle.

  If you have deeply nested state, consider refactoring to make it shallower, or use helper functions to update nested structures without mutation. Libraries like `immer` can also help, but NgRx does not use Immer by default (unlike Redux Toolkit) – so it’s on you to enforce immutability.

- **Group Similar Actions:** If multiple actions have the exact same state effect, you can handle them in one `on` function. For example, if `addItemSuccess` and `updateItemSuccess` both set `loading: false` and update an item list, you could do:

  ```ts
  on(ItemActions.addItemSuccess, ItemActions.updateItemSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    items: items
  })),
  ```

  This prevents repeating logic. But use this judiciously – only combine if the state changes are truly identical. It's often still fine to separate for clarity, especially if the payloads differ.

- **Initial State:** Define a clear `initialState` for each reducer. This ensures your app has a well-known starting point. Put sample or empty values for each state property (e.g., empty arrays, nulls, or default objects). For example, `initialAuthState` might have `user: null, isAuthenticated: false, loading: false, error: null`. This makes assumptions explicit. Also, the initial state is used if the store is uninitialized or if the reducer receives an undefined state (NgRx calls your reducer with undefined to get the initial state). If using the `createReducer` pattern as above, the first argument is the initial state, so you’re covered.

- **Keep Reducers Focused:** A reducer should ideally focus on one slice of state (the slice it manages). Don’t write one giant reducer handling multiple unrelated slices. If you notice a reducer file growing too large or handling disparate things, it might be a sign to split the state. For example, if `appReducer` is handling both user authentication and UI layout, better to have `authReducer` and `layoutReducer` separately, and combine them at the root.

- **Normalize State Shape:** If your state includes collections of entities, consider storing them in a normalized form. Instead of an array of items that you search through to update or remove, use an object/map keyed by ID plus an array of IDs for ordering if needed. NgRx provides the **Entity** library (`@ngrx/entity`) to help with this. Using `EntityState` can drastically simplify reducer logic for common operations like add, update, delete for lists of things. For instance, using `createEntityAdapter`, you get methods like `addOne`, `updateOne`, `removeOne` that handle immutably updating an entity collection by id, and built-in selectors for free. If you find yourself writing a lot of similar code for different data lists, adopting `@ngrx/entity` is a good move to reduce boilerplate and ensure performance (it uses map/dictionary under the hood for fast lookup).

  Not all state needs to be normalized – if you have small lists or very static data, simple arrays might suffice. But for large or frequently updated collections, normalization is the way to go (single source of truth for each entity).

- **No Side Effects in Reducers:** Reducers must be pure. This means no calling APIs, no router navigation, no generating random IDs (unless you consider that pure enough but it's better not to). If you need to perform a side effect in response to an action (like navigate after login success, or show a toast notification), those should be handled in an Effect or in the component that dispatched the action, not in the reducer. A reducer should just compute new state. This makes them easy to test and reason about.

- **Handling Loading and Errors:** A common pattern is to include `loading` and `error` flags in state for asynchronous operations. For example, an entity’s state might have `isLoading` and `error` fields. Reducers should set these appropriately:

  - When a load action is dispatched, set `isLoading: true` and clear any previous error.
  - On success, set `isLoading: false` and update data.
  - On failure, set `isLoading: false` and store the error (and possibly preserve or clear outdated data depending on context).

  This consistent pattern helps UI components show spinners or messages based on store state. It’s recommended to handle those flags as part of your reducer logic for completeness.

- **Combine Reducers at the Right Level:** If using feature modules, each feature might export its reducer function. At the root, either use `StoreModule.forRoot` with an object of all top-level reducers, or use the new `provideStore`. In Angular 16+, `provideStore()` without arguments is a shorthand for setting up an empty root store, then use `provideState(featureKey, reducer)` for each slice. In older versions, you likely had a `reducers/index.ts` where you combine:

  ```ts
  export interface AppState { auth: AuthState; products: ProductsState; /* ... */ }

  export const appReducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    products: productsReducer,
    //...
  };
  ```

  Then `StoreModule.forRoot(appReducers)` in AppModule. Both achieve the same end: all feature reducers are registered. The important part is to ensure every reducer is added; if you forget to add a feature reducer, dispatching its actions will do nothing (and NgRx may log a warning like "no reducer for action type X" in development).

- **Runtime Checks:** When configuring StoreModule, enabling runtime checks (like immutability check, serializability check) is recommended in development. These checks will throw errors if you accidentally mutate state or include a non-serializable value (such as a Date, which by default is considered non-serializable) in state or actions. Use

  ```ts
  StoreModule.forRoot(reducers, {
    runtimeChecks: {
      strictStateImmutability: true,
      strictActionImmutability: true,
      strictStateSerializability: true,
      strictActionSerializability: true
    }
  })
  ```

  for example. This helps catch mistakes early.
- **Example Reducer with Entity:**

  ```ts
  // products.state.ts
  import { createEntityAdapter, EntityState } from '@ngrx/entity';

  export interface Product {
    id: string;
    name: string;
    price: number;
  }

  export interface ProductsState extends EntityState<Product> {
    loaded: boolean;
    error: string | null;
  }

  export const productsAdapter = createEntityAdapter<Product>();

  export const initialProductsState: ProductsState = productsAdapter.getInitialState({
    loaded: false,
    error: null
  });

  // products.reducer.ts
  import { productsAdapter, initialProductsState, ProductsState } from './products.state';
  import * as ProductsActions from './products.actions';
  import { createReducer, on } from '@ngrx/store';

  export const productsReducer = createReducer(
    initialProductsState,

    on(ProductsActions.loadProducts, state => ({
      ...state,
      loaded: false,
      error: null
    })),

    on(ProductsActions.loadProductsSuccess, (state, { products }) =>
      productsAdapter.setAll(products, { ...state, loaded: true })
    ),

    on(ProductsActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      loaded: true,
      error: error
    })),

    on(ProductsActions.addProductSuccess, (state, { product }) =>
      productsAdapter.addOne(product, state)
    ),

    on(ProductsActions.updateProductSuccess, (state, { update }) =>
      productsAdapter.updateOne(update, state)
    ),

    on(ProductsActions.deleteProductSuccess, (state, { id }) =>
      productsAdapter.removeOne(id, state)
    )
    // ... etc.
  );
  ```

  Here, `ngrx/entity` is used for products. Notice how we delegate repetitive tasks to the adapter (like setting all, adding one). This keeps the reducer concise. We still track `loaded` and `error` in state for status. With this setup, we also gain `productsAdapter.getSelectors()` which gives selectors like `selectAll` (we can integrate those in our selectors file).

- **Testing Reducers:** Since reducers are pure, testing them is straightforward. You can feed in a sample state and an action, and assert the returned state matches expectations. For example, given some state with `loaded: false`, when `loadProductsSuccess` with some products is reduced, assert that the new state has `loaded: true` and that the products are present. Because they’re just functions, this is easy to automate. We’ll touch more on testing later, but the simplicity of testing is a direct payoff of keeping reducers pure and well-structured.

To sum up, reducers should be boring, predictable, and free of surprises. They take an input and return an output with no side effects. Strive for simplicity – if a reducer starts getting complicated (lots of branching logic, etc.), consider refactoring or moving some logic to an effect or pre-processing before dispatch. A well-written reducer, combined with well-defined actions, makes the state transitions in your app very easy to follow and debug.

## Handling Effects

Effects (NgRx Effects via the `@ngrx/effects` package) are where we handle **side effects** – any asynchronous work or interactions with the outside world in response to actions. This includes API calls, router navigation, localStorage access, and other tasks that should not run inside reducers. Here’s how to use Effects effectively:

- **One Effect per Logical Side Effect:** Generally, create a separate effect for each distinct stream of actions you want to handle. For example, if when a `login` action is dispatched you need to call an API and then dispatch success/failure, that’s one effect (say, `login$`). If when a `logout` action is dispatched you want to navigate to a login page, that could be another effect (`logout$`). Keeping them separate makes them easier to test and reason about. It’s common to group effects in a class by feature, e.g., `AuthEffects` contains `login$`, `logout$`, `register$`, etc., all related to authentication.

- **Use `createEffect`:** Define effects using `createEffect(() => this.actions$.pipe(...))`. The `this.actions$` stream is an injection of all actions in the app. You filter it with `ofType(...)` to react only to specific actions. For example:

  ```ts
  // file: auth.effects.ts
  import { Actions, createEffect, ofType } from '@ngrx/effects';
  import { Injectable } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthService } from '../services/auth.service';
  import * as AuthActions from './auth.actions';
  import { switchMap, map, catchError, tap } from 'rxjs/operators';
  import { of } from 'rxjs';

  @Injectable()
  export class AuthEffects {
    constructor(private actions$: Actions,
                private authService: AuthService,
                private router: Router) {}

    login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),  // listen for login action
        switchMap(action =>
          this.authService.login(action.credentials).pipe(
            map(user => AuthActions.loginSuccess({ user })),
            catchError(error => of(AuthActions.loginFailure({ error })))
          )
        )
      )
    );

    loginRedirect$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
      { dispatch: false }  // this effect does not dispatch an action
    );
  }
  ```

  In the `login$` effect above, when a `login` action happens, we use `switchMap` to call the AuthService (which returns an Observable, say an HTTP call). On success, we `map` the result to a `loginSuccess` action (dispatching the user data to the store), and on failure we catch the error and return a `loginFailure` action. This encapsulates the async flow of logging in. The `loginRedirect$` effect listens for a successful login action and then performs a side effect (navigating to a dashboard page) without dispatching any further action (hence `dispatch: false`).

  This separation of concerns is important: the first effect handles *state update* (via an action), the second handles *impure side effect* (navigation). We could have combined them (e.g., do navigation inside the success case of the first effect), but splitting them makes it easier to test and keeps each effect focused.

- **Choosing Flattening Operators:** The choice of `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` matters in effects:

  - Use `switchMap` when you want to cancel any previous request if the same effect triggers again. For example, a search box where each keystroke dispatches an action: you’d want to cancel the old query when a new one comes in. Also common for navigation or auto-complete scenarios.

  - Use `concatMap` when each action must be processed in order and one at a time (it queues them). For instance, if you dispatch two save actions quickly and you want to ensure the second waits for the first to complete (maybe order matters on the backend). It’s less common but important for sequences.

  - Use `mergeMap` for fire-and-forget parallel processing. This will kick off all tasks and not wait; responses can come back out of order. It’s good when actions are independent (e.g., deleting multiple items, where each delete can happen concurrently). Be mindful that `mergeMap` can lead to multiple simultaneous service calls.

  - Use `exhaustMap` when you want to ignore new actions until the current one finishes. A classic example is a login button: if a user clicks multiple times, you likely want to only run the first login request and ignore the rest until it’s done. This prevents duplicate submissions.

  Understanding these is key to avoiding memory leaks or unintended concurrent behaviors. In many simple cases, `switchMap` is a safe default for single API calls (ensures no piling up). If you need parallel, go for `mergeMap`. If strict ordering, `concatMap`.

- **Error Handling:** Always handle errors inside your effect’s observable chain. As shown, we used `catchError` to intercept errors from `authService.login`. By mapping errors to a failure action (inside an `of(...)` observable), we ensure the effect stream itself does not error out. If you neglect to catch an error, that effect will complete and **stop listening** for further actions, which is a common pitfall. Essentially, an uncaught error in an effect is like an unhandled exception – it breaks that effect. So make it a rule: every `switchMap`/`mergeMap` call that leads to an Observable (like an HTTP call) should be followed by a `catchError` in the chain that returns a clean observable (either a failure action or some fallback). If the action doesn’t really need an error action (maybe you just want to ignore errors), you should still catch it and return `of(EMPTY_ACTION)` or use `EMPTY` observable to swallow it, just to keep the stream alive.

- **Non-Dispatching Effects:** If an effect doesn’t need to dispatch an action, set `{ dispatch: false }` in the `createEffect` options. Typical cases:

  - Navigation or other imperative side effects (as in the `loginRedirect$` example).
  - Logging or analytics (e.g., send data to Google Analytics after certain actions).
  - Optimistically performing some operation that doesn’t need to update store.

  These effects will just subscribe to the actions and do something, then complete. Not dispatching an action avoids unnecessary cycles. If you forget to set `dispatch: false` on an effect that doesn’t return an action, NgRx will warn you (because the stream will complete without emitting an action, which by default it expects at least one or an error).

- **Effect Lifecycle:** Effects by default are `{ dispatch: true, useEffectsErrorHandler: true }`. They start running as soon as they are registered (i.e., after `EffectsModule.forFeature` or `.forRoot` is called). If an effect should run only once on app init, you typically have an action like `appInit` that you dispatch in `ngOnInit` of `AppComponent` or use the `onInitEffects` interface to dispatch from the effect itself. But avoid long-running init logic in constructors – rely on actions to kick things off so it’s testable and traceable.

- **Using State in Effects:** Sometimes an effect needs to know some current state from the store (for example, to decide whether to make a request or use cached data). You can combine streams by using the `withLatestFrom` operator inside an effect. For instance:

  ```ts
  on(SomeAction, (action) => this.store.select(selectSomething).pipe(
    withLatestFrom(this.store.select(selectOther)),
    mergeMap(([something, other]) => {
      // use `something` and `other` along with action to determine outcome
    })
  ))
  ```

  Or using actions$ stream:

  ```ts
  someEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(doSomething),
      withLatestFrom(this.store.select(selectData)),
      switchMap(([action, data]) => {
        if (data) {
          return of(skipApiCallAction()); // maybe we already have data
        } else {
          return this.service.fetch().pipe(
            map(result => fetchSuccess({ result }))
          );
        }
      })
    )
  );
  ```

  Using `withLatestFrom` can be powerful but be cautious: do not use it to actually *update* state in an unsafe way. For example, don't grab the store value and then try to modify it inside an effect and dispatch that — let reducers handle state updates. If you find an effect is doing a lot of state-dependent logic, consider if that logic should live in a service or in the component dispatching the action (to decide what action to dispatch). Often, it's cleaner to structure actions such that they contain all info needed for the effect, reducing the effect’s need to query the store. But when needed, `withLatestFrom` is there.

- **Effect Performance:** Effects run whenever their `ofType` matches an action. Try to avoid extremely broad matches if not necessary. For example, `ofType("*")` (wildcard, if it existed) would respond to everything – don’t do that. Also, be mindful of using take(1) or filtering in effects if you only want the first occurrence of something. But most of the time, effects are fine to stay active. They are essentially event handlers.

- **Cancellation and Completion:** If using `switchMap`, as noted, previous observables are canceled when a new action comes. With `concatMap` or `mergeMap`, you might want to explicitly handle teardown. If an effect involves long-lived observables (like a websocket subscription), ensure you manage its cancellation when appropriate (maybe on some "stop" action, you use takeUntil).

- **Testing Effects:** We’ll cover testing later, but essentially, you can simulate actions and mock services to ensure effects dispatch the right actions. The example above is quite testable: you’d provide a fake AuthService that returns an observable, push a `login` action through the actions$, and expect a `loginSuccess` or `loginFailure` output.

In summary, Effects are where side effects meet the Redux flow. Keep your effects focused on one job each, handle errors diligently, and use the appropriate RxJS tools for the job. Done right, effects greatly simplify your components (since components no longer handle async logic – they just dispatch an action and trust the effect to do the work and update state). This separation makes for cleaner and more maintainable code.

## Using Selectors

Selectors are pure functions that derive slices of state or compute values based on the store. They are essential for efficient and reusable state querying. Follow these best practices:

- **Use `createFeatureSelector` and `createSelector`:** For feature state, start by creating a feature selector:

  ```ts
  import { createFeatureSelector, createSelector } from '@ngrx/store';
  import { AuthState } from './auth.state';

  export const selectAuthState = createFeatureSelector<AuthState>('auth');
  ```

  This lets you select the whole `auth` feature state from the store.

- **Build Specific Selectors:** Use `createSelector` to compose smaller selectors from the feature selector or other selectors.

  ```ts
  export const selectUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user
  );

  export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
  );
  ```

- **Memoization:** Selectors created with `createSelector` are memoized by default. This means if the inputs haven’t changed, the selector returns the cached result without recalculating. This improves performance and avoids unnecessary re-renders.

- **Naming Convention:** Name selectors with a `select` prefix, such as `selectUser`, `selectCartItems`, `selectIsLoading`, to clearly indicate their purpose.

- **Avoid Selectors with Side Effects:** Selectors should be pure and synchronous. They should never perform side effects like HTTP calls or dispatch actions. Their sole job is to derive and return data from the store.

- **Use Selectors in Components:** Components should use the store’s `select` method with selectors to get data. This keeps components clean and reactive.

  ```ts
  this.user$ = this.store.select(selectUser);
  ```

- **Selectors Can Compose:** You can build complex selectors by composing simpler ones. For example, a selector can combine multiple pieces of state:

  ```ts
  export const selectUserProfile = createSelector(
    selectUser,
    selectUserPreferences,
    (user, preferences) => ({
      ...user,
      preferences
    })
  );
  ```

- **Avoid Passing Store to Services:** Instead of injecting the store into services, it’s best practice to keep the store access in components or effects and pass data as parameters into services. This avoids tight coupling and keeps services pure.

- **Selector Performance:** Keep selectors fast. Avoid expensive computations inside selectors; if needed, move complex logic to pure helper functions or memoize manually.

- **Testing Selectors:** Testing selectors is simple – call the selector function with a sample state and verify the returned value matches expectations. Because selectors are pure, tests are straightforward.

By using selectors consistently, you ensure components and other consumers get exactly the state they need, efficiently and cleanly.

## Testing

Testing your NgRx store code is vital for reliability and maintainability. Here are guidelines for testing actions, reducers, selectors, and effects:

- **Testing Actions:** Actions created with `createAction` are simple functions. You can test them by verifying their type and payload.

  ```ts
  import * as AuthActions from './auth.actions';

  describe('Auth Actions', () => {
    it('should create login action', () => {
      const credentials = { email: 'test@test.com', password: '123456' };
      const action = AuthActions.login({ credentials });

      expect(action.type).toBe('[Auth Page] Login');
      expect(action.credentials).toEqual(credentials);
    });
  });
  ```

- **Testing Reducers:** Since reducers are pure functions, testing them is straightforward. Provide an initial state and an action, then assert the returned state is as expected.

  ```ts
  import { authReducer } from './auth.reducer';
  import * as AuthActions from './auth.actions';
  import { initialAuthState } from './auth.state';

  describe('Auth Reducer', () => {
    it('should set loading true on login', () => {
      const action = AuthActions.login({ credentials: { email: '', password: '' } });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBeTrue();
      expect(state.error).toBeNull();
    });

    it('should set user and loading false on loginSuccess', () => {
      const user = { id: 1, name: 'Test User' };
      const action = AuthActions.loginSuccess({ user });
      const state = authReducer(initialAuthState, action);

      expect(state.loading).toBeFalse();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBeTrue();
    });
  });
  ```

- **Testing Selectors:** Selectors are pure functions. Pass in a mock state and verify the selector returns the expected slice or derived data.

  ```ts
  import * as fromAuth from './auth.selectors';
  import { AuthState } from './auth.state';

  describe('Auth Selectors', () => {
    const authState: AuthState = {
      user: { id: 1, name: 'Test User' },
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    it('should select user', () => {
      const result = fromAuth.selectUser.projector(authState);
      expect(result).toEqual(authState.user);
    });

    it('should select isAuthenticated', () => {
      const result = fromAuth.selectIsAuthenticated.projector(authState);
      expect(result).toBeTrue();
    });
  });
  ```

- **Testing Effects:** Effects often require more setup because they depend on injected services and the action stream. Use the `provideMockActions` helper from `@ngrx/effects/testing` to simulate action streams and `jasmine-marbles` or RxJS `TestScheduler` to test observables.

  ```ts
  import { TestBed } from '@angular/core/testing';
  import { provideMockActions } from '@ngrx/effects/testing';
  import { Observable, of, throwError } from 'rxjs';
  import { AuthEffects } from './auth.effects';
  import * as AuthActions from './auth.actions';
  import { AuthService } from '../services/auth.service';
  import { cold, hot } from 'jasmine-marbles';

  describe('AuthEffects', () => {
    let actions$: Observable<any>;
    let effects: AuthEffects;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
      const spy = jasmine.createSpyObj('AuthService', ['login']);

      TestBed.configureTestingModule({
        providers: [
          AuthEffects,
          provideMockActions(() => actions$),
          { provide: AuthService, useValue: spy },
        ],
      });

      effects = TestBed.inject(AuthEffects);
      authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should dispatch loginSuccess on successful login', () => {
      const user = { id: 1, name: 'Test User' };
      const credentials = { email: 'test@test.com', password: '123456' };
      const action = AuthActions.login({ credentials });
      const outcome = AuthActions.loginSuccess({ user });

      actions$ = hot('-a', { a: action });
      const response = cold('-b|', { b: user });
      authService.login.and.returnValue(response);

      const expected = cold('--c', { c: outcome });
      expect(effects.login$).toBeObservable(expected);
    });

    it('should dispatch loginFailure on failed login', () => {
      const credentials = { email: 'test@test.com', password: 'wrong' };
      const action = AuthActions.login({ credentials });
      const error = 'Invalid credentials';
      const outcome = AuthActions.loginFailure({ error });

      actions$ = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      authService.login.and.returnValue(response);

      const expected = cold('--c', { c: outcome });
      expect(effects.login$).toBeObservable(expected);
    });
  });
  ```

- **Test Coverage:** Aim to cover the happy path and error cases for reducers and effects. Tests help catch regressions early and ensure your NgRx logic behaves as expected when your app evolves.

By rigorously testing your NgRx code, you increase confidence and maintain a high-quality, predictable state management layer in your Angular app.
