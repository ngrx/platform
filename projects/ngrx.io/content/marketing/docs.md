<h1 class="no-toc">What is NgRx?</h1>

NgRx is a framework for building reactive applications in Angular. NgRx provides state management, isolation of side effects, entity collection management, router bindings, code generation, and developer tools that enhance developers experience when building many different types of applications.

## Core Principles

- State is a single, immutable data structure.
- Components delegate responsibilities to side effects, which are handled in isolation.
- Type-safety is promoted throughout the architecture with reliance on TypeScript's compiler for program correctness.
- Actions and state are serializable to ensure state is predictably stored, rehydrated, and replayed.
- Promotes use of functional programming when building reactive applications.
- Provide straightforward testing strategies for validation of functionality.

## Packages

- [Store](guide/store) - RxJS powered state management for Angular apps, inspired by Redux.
- [Store Devtools](guide/store-devtools) - Instrumentation for @ngrx/store enabling time-travel debugging.
- [Effects](guide/effects) - Side effect model for @ngrx/store.
- [Router Store](guide/router-store) - Bindings to connect the Angular Router to @ngrx/store.
- [Entity](guide/entity) - Entity State adapter for managing record collections.
- [Schematics](guide/schematics) - Scaffolding library for Angular applications using NgRx libraries.
