<details>
  <summary>How to connect my signal store(s) with Redux DevTools?</summary>

    There's no official connection between `@ngrx/signals` and the Redux Devtools.
    We expect the Angular Devtools will provide support for signals soon, which can be used to track the state.
    However, you could create a feature for this, or you can make use of the [`withDevtools` feature](https://github.com/angular-architects/ngrx-toolkit?tab=readme-ov-file#devtools-withdevtools) from angular-architects/ngrx-toolkit.
</details>

<details>
  <summary>Is there a way to define private methods on a signal store?</summary>

    Currently there's no built-in support for private properties.
    To achieve this in the current version, you can resort to workarounds, e.g. by not returning them.

```ts
withMethods(() => {
    privateFunction() { 
        /* implementation here */ 
    }
    publicFunction() { 
        /* implementation here */
    }
    publicFunction2() { 
        // it's possible to invoke private methods
        privateFunction();
    }

    return { publicFunction, publicFunction2 };
})
```
</details>

<details>
  <summary>Can I  interact with my NgRx Actions within a signal store?</summary>

    Signals are not meant to have a concept of time. Also, the effect is somewhat tied to Angular change detection, so you can't observe every action that would be dispatched over time through some sort of Signal API.
    The global NgRx store is still the best mechanism to dispatch action(s) over time and react to them across multiple features.
</details>

<details>
  <summary>Can I use the Redux pattern (reducers) to build my state?</summary>

    Just like @ngrx/component-store, there is no indirection between events and how it affects the state. To update the signal store's state use the methods provided by [`SignalStore`](/guide/signals/signal-store) and [`SignalState`](/guide/signals/signal-state).
    But, a signal store is extensible and you can build your own custom feature that uses the Redux pattern. 
</details>

<details>
  <summary>Can I define my signal store as a class?</summary>

    To create a class-based signal store, create a new class and extend from `signalStore`.

```ts
export MyStore extends signalStore(withState(initialState)) {
    private myMethod() {}
}
```
</details>