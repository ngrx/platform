<details>
  <summary>How to connect my SignalStore(s) with Redux DevTools?</summary>

    There's no official connection between `@ngrx/signals` and the Redux Devtools.
    We expect the Angular Devtools will provide support for signals soon, which can be used to track the state.
    However, you could create a feature for this, or you can make use of the [`withDevtools` feature](https://github.com/angular-architects/ngrx-toolkit?tab=readme-ov-file#devtools-withdevtools) from the `@angular-architects/ngrx-toolkit` package.
</details>

<details>
  <summary>Can I interact with my NgRx Actions within a SignalStore?</summary>

    Signals are not meant to have a concept of time. Also, the effect is somewhat tied to Angular change detection, so you can't observe every action that would be dispatched over time through some sort of Signal API.
    The global NgRx Store is still the best mechanism to dispatch action(s) over time and react to them across multiple features.
</details>

<details>
  <summary>Can I use the Redux pattern (reducers) to build my state?</summary>

    Just like `@ngrx/component-store`, there is no indirection between events and how it affects the state. To update the SignalStore's state use the `patchState` function.
    However, SignalStore is extensible and you can build your own custom feature that uses the Redux pattern. 
</details>

<details>
  <summary>Can I define my SignalStore as a class?</summary>

    To create a class-based SignalStore, create a new class and extend from `signalStore`.

```ts
@Injectable()
export class CounterStore extends signalStore(
  { protectedState: false },
  withState({ count: 0 })
) {
  readonly doubleCount = computed(() => this.count() * 2);

  increment(): void {
    patchState(this, { count: this.count() + 1 });
  }
}
```
</details>

<details>
  <summary>How can I get the type of a SignalStore?</summary>

    To get the type of a SignalStore, use the `InstanceType` utility type.

```ts
const CounterStore = signalStore(withState({ count: 0 }));

type CounterStore = InstanceType<typeof CounterStore>;

function logCount(store: CounterStore): void {
  console.log(store.count());
}
```
</details>

<details>
  <summary>Can I inject a SignalStore via the constructor?</summary>

    To inject a SignalStore via the constructor, define and export its type with the same name.

```ts
// counter.store.ts
export const CounterStore = signalStore(withState({ count: 0 }));

export type CounterStore = InstanceType<typeof CounterStore>;

// counter.component.ts
import { CounterStore } from './counter.store';

@Component({ /* ... */ })
export class CounterComponent {
  constructor(readonly store: CounterStore) {}
}
```

</details>

<details>
<summary>I get the error "Cannot assign to read only property 'X' of object '[object Object]'"</summary>

The state in the SignalStore must be immutable. If you make mutable changes, there’s a high risk of introducing subtle, hard-to-diagnose bugs. To protect against this, SignalStore introduced an additional check to enforce immutability.

The immutability requirement originates from Angular's Signal itself, which serves as the foundation of the SignalStore. Here’s an example to illustrate this:

```ts
const person = signal({ name: 'Konrad', age: 25 });
const personFormat = computed(
  () => `${person().name} is ${person().age} years old`,
);

console.log(personFormat()); // shows 25 years

person().age = 30; // 👎 mutable change
console.log(personFormat()); // 👎 person did not notify personFormat. still 25 years

// another mutable change
person.update((value) => {
  value.age++; // 👎 
  return value;
});

console.log(personFormat()); // 👎 no notification. 25 years.

// immutable change
person.update((value) => ({
  ...value, // 👍 immutable change
  age: 40,
}));
console.log(personFormat()); // 👍 personFormat has been notified and shows 40 years.

```

As you can see, the problem typically arises in computed, effect or the component's template, not directly at the root (the signal mutation itself). This is why these issues are so hard to debug.

You might look into your components wondering why they’re not updating, while the real error is buried deep within the SignalStore.

Therefore, both `signalState` and `signalStore` throw on those mutable changes. They protect you!

```typescript
const person = signalState({ name: 'Konrad', age: 25 });
patchState(person, (value) => {
  value.age++
  return value;
}) // 🔥 throws


person().age = 30; // 🔥 throws 
```

If you require mutable properties in your state, then put them into `withProps`.

Common examples are `FormGroup` or instances from the router package:

```ts
const PersonStore = signalStore(
  withProps(() => {
    const router = inject(Router);
    
    return {
      _currentUrl$: router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => router.routerState.snapshot.url),
      )
    };
  }),
  withState({ name: 'Konrad', age: 25 }),
  withMethods(store => ({
    setAge(age: number) {
      store.age = age;
    }
  })));
const personStore = new PersonStore();

personStore.setAge(30);
```

</details>
