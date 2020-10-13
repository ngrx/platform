<h1 class="no-toc">What is NgRx?</h1>

NgRx is a framework for building reactive applications in Angular. NgRx provides libraries for:

- Managing global and local state.
- Isolation of side effects to promote a cleaner component architecture.
- Entity collection management.
- Integration with the Angular Router.
- Developer tooling that enhances developer experience when building many different types of applications.

## Packages

NgRx packages are divided into a few main categories

### State

- [Store](guide/store) - RxJS powered global state management for Angular apps, inspired by Redux.
- [Effects](guide/effects) - Side effect model for @ngrx/store.
- [Router Store](guide/router-store) - Bindings to connect the Angular Router to @ngrx/store.
- [Entity](guide/entity) - Entity State adapter for managing record collections.
- [ComponentStore](guide/component-store) - Standalone library for managing local/component state.

### Data
- [Data](guide/data) - Extension for simplified entity data management.

### View

- [Component](guide/component) - Extension for fully reactive Angular applications.

### Developer Tooling

- [Store Devtools](guide/store-devtools) - Instrumentation for @ngrx/store that enables visual tracking of state and time-travel debugging.
- [Schematics](guide/schematics) - Scaffolding library for Angular applications using NgRx libraries.
