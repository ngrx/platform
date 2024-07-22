# Testing

There are two scenarios when it comes to testing:

1. Testing the `signalStore` itself,
2. Testing a component/service which uses the Signal Store.

Whereas in the first scenario, mocking will happen for dependencies of the Signal Store, scenario 2 might require to mock the Signal Store itself.

The examples are using the Jest API, but the same principles apply to other testing frameworks.

## Testing the Signal Store

### Testing without `TestBed`

The Signal Store is a function that returns a class. That means a test can instantiate the class and test it without the TestBed:

<code-example header="movies.store.ts">
import {signalStore} from "./signal-store";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export const MoviesStore = signalStore(withState({movies: [{id: 1, name: 'A New Hope'}, {id: 2, name: 'Into Darkness'}, {id: 3, name: 'The Lord of the Rings'}]}));
</code-example>

<code-example header="movies.store.spec.ts">
import {MoviesStore} from "./movies.store";

it('should verify that 3 movies are available', () => {
  const store = new MoviesStore();
  expect(store.movies()).toHaveLength(3);
});

</code-example>

In practice, you will use the `TestBed` because among many advantages, it mocks dependencies and triggers the execution of `effects`.

<div class="alert is-helpful">

**Note:**: Using the TestBed is also the recommendation of the [Angular team](https://github.com/angular/angular/issues/54438#issuecomment-1971813177). 

</div>

### Testing with `TestBed`

## Mocking the Signal Store


Implementation Notes:
- Using TestBed instead of Injector. Don't really see the benefits of using Injector. TestBed is more common and as easy to use.
