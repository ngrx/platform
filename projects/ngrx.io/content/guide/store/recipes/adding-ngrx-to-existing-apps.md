# Adding NgRx to existing Angular applications

## How do apps without NgRx typically function?

Most of the applications out there do not use NgRx. But most applications follow the typical patterns and solve common problems, which are:

1. Retrieving data from a remote API
2. Saving that data in a component state (say, on some property like `userList`) 
3. Display that data in the UI
4. Make alterations of the data in the backend (add, update or delete entries)
5. Again, display the results of those actions in the UI (success messages, updated lists of data, and so on)

Usually to do that, developers write services which inject the Angular's `HttpClient`, write methods to retrieve or modify specific parts of the data, then inject those services in the components and use them, tightly coupled with the components. Let's see an example of such a "conventional" component:

<code-example header="to-do-list.component.ts">
@Component({
    selector: 'app-to-do-list',
    template: `
      &lt;div&gt;
        &lt;ul&gt;
          &lt;li *ngFor="let todo of todos"&gt;
            &lt;span&gt;{{ todo.text }}&lt;/span&gt;
            &lt;button (click)="removeTodo(todo.id)"&gt;X&lt;/button&gt;
          &lt;/li&gt;
        &lt;/ul&gt;
        &lt;div&gt;
          &lt;input #todoName placeholder="Add new To-Do Item"/&gt;
          &lt;button (click)="addToDo(#todoName.value)"&gt;Save To-Do Item&lt;/button&gt;
      &lt;/div&gt;
    `
})
export class ToDoListComponent implements OnInit {
    todos: ToDo[] = [];
    
    constructor(
        private readonly todoService: TodoService,
        private toastService: ToastService,
    ) {}
    
    ngOnInit() {
        this.getToDos();
    }
    
    addToDo(toDoName: string) {
        this.todoService.addToDo().subscribe(
            (createdToDo) =&gt; {
                this.todos = [...this.todos, createdToDo];
                this.toastService.displaySuccessMessage('To Do Item Successfully Added');
            },
            error =&gt; this.toastService.displayErrorMessage(error.message),
        );
    }
    
    removeToDo(toDoId: number) {
        this.todoService.removeToDo(toDoId).subscribe(
            () =&gt; {
                this.todos = this.todos.filter(todo =&gt; todo.id !== toDoId);
                this.toastService.displaySuccessMessage('To Do Item Successfully Removed');
            },
            error =&gt; this.toastService.displayErrorMessage(error.message),
        );
    }
    
    private getToDos() {
        this.todoService.getToDos().subscribe(
            todos =&gt; this.todos = todos,
            error =&gt; this.toastService.displayErrorMessage(error.message),
        );
    }
}
</code-example>

Now this component is dealing with a fairly large chunk of the application state: it stores the To-Do items list, it allows to add new items and remove them. Of course, every time we do any modifications, we have to also manually update the state (the `todos` array) to accurately reflect the new state of the application. 

Now this component does lots of heavy lifting that does not really belong here. Ideally, the component will just have a list of `todos` served to it, being updated reactively every time there is a modification to the state. This is where NgRsx comes into the mix.

## Switching to NgRx

We are going to overwrite the component using NgRx. We are not going to overwrite the service, as it is performing its duties fairly well. Remember, **NgRx is not there to replace services**. Instead, it is meant to decouple services from te components, so we only deal with the incoming data in them, rather then doing imperative logic to keep the state up-to-date.

We are going to add [@ngrx/store](guide/store/index) and [`@ngrx/effects`](guide/effects/index) (because we are going to use HTTP calls). 

In our `app` folder let's add folders for our NgRx related code. We are gping to have folders named `reducers`, `actions`, `selectors` and `effects`. In those folders we are going to add the files `todos.actions.ts`, `todos.reducer.ts`, `todos.selectors.ts` and `todos.effects.ts`.

Now we are going to populate those files with code to handle our application state.

### Understanding the state

First of all, let's understand what features we have, and what state is stored under each feature. In our case, it is simple: we have a `ToDos` feature, which holds an array of `todos`. Let's create interfaces to describe our application state inside the `reducers/todos.reducer.ts` file:

<code-example header="todos.reducer.ts">
export interface ToDo {
    id: number;
    text: string;
}

export interface ToDosState {
    list: ToDo[];
}

export interface AppState {
    toDos: ToDosState;
}

export const todosInitialState: ToDosState = {
    list: [],
};
</code-example>

In this file, we have explained that our application-wide state has a feature named `toDos`, and that state as a `list` of `ToDo` items, which initially is an empty array. 

### Understanding how the state can be modified

Now we have a schema of how our state looks, Let's now describe in what ways can it be modified. To do that, let's create some actions in the `todos.actions.ts`. 

[Actions](guide/store/actions) are unique events in our application that will signal the store about what happened and what to do.

We are going to need actions for the following things:

1. Retrieving `todos` from the API. For that, we need three actions: a command to retrieve the list, a success action, and an error action, to describe what happens to the application state o each of those scenarios
2. Adding a `todo` item (again, three actions)
3. Removing a `todo` item (three actions)

Here is what our `actions.ts` file might look like:

<code-example header="todos.actions.ts">
import { createAction, props } from '@ngrx/store';
import { ToDo } from './state';

export const loadToDos = createAction('[ToDo List] Load To-Dos'); 
export const loadToDosSuccess = createAction(
    '[ToDo List API] Load To-Dos Success',
    props&lt;{payload: ToDo}&gt;(),
);
export const loadToDosError = createAction(
    '[ToDo List API] Load To-Dos Error',
    props&lt;{payload: Error}&gt;(),
);

export const addToDo = createAction(
    '[ToDo List] Add To-Do',
    props&lt;{payload: Omit&lt;ToDo, 'id'&gt;}&gt;(), // we don't have an idea when we start creating a todo item
); 
export const addToDoSuccess = createAction(
    '[ToDo List API] Add To-Do Success',
    props&lt;{payload: ToDo}&gt;(), // when the todo item is successfully created, the backend will return a full todo with id
);
export const addToDoError = createAction(
    '[ToDo List API] Add To-Do Error',
    props&lt;{payload: Error}&gt;(),
);

export const removeToDo = createAction(
    '[ToDo List] Remove To-Do',
    props&lt;{payload: number}&gt;(), // the id of the todo item ot be deleted
); 
export const removeToDoSuccess = createAction(
    '[ToDo List API] Remove To-Do Success',
    props&lt;{payload: number}&gt;(), //the same id to use in the reducer
);
export const removeToDoError = createAction(
    '[ToDo List API] Remove To-Do Error',
    props&lt;{payload: Error}&gt;(),
);
</code-example>

Now this part is very straightforward, it only describes in *what ways* can the state be modified. Now let's describe *how* is it modified.

### Modifying the state

To be able to react to dispatched actions and modify our application state, we need a [reducer](guide/store/reducers), a pure function that receives the previous state and a dispatched action as arguments and returns the new state.
 
It is high time to write a reducer so that we can register our store:

<code-example header="todos.reducer.ts">
import { createReducer, on, Action } from '@ngrx/store';

import * as todos '../actions/todos.actions';

// state interface and initialState

const _todosReducer = createReducer(
    todosInitialState,
    on(todos.loadToDosSuccess, (state, action) =&gt; ({...state, list: action.payload})),
    on(todos.addToDoSuccess, (state, action) =&gt; ({...state, list: [...state.list, action.payload]})),
    on(todos.removeToDoSuccess, (state, action) =&gt; ({...state, list: list.filter(todo =&gt; todo.id !== action.payload)})),
);

export function todosReducer(state: ToDosState, action: Action) {
    return _todosReducer(state, action);
}
</code-example>

The, we can register our reducer with the `StoreModule` in our `AppModule`:

<code-example header="app.module.ts">
@NgModule({
    // other metadata
    imports: [
        // other imports,
        StoreModule.forRoot({toDos: todosReducer}),
    ] 
})
export class AppModule {}
</code-example>

Notice we only update the store on `success` actions: we will first call the API service, it will successfully update the database, and only then will we update our application state. To do this, we are going to write an [Effect](guide/effects/index) in the `app/effects/todos.effects.ts` file. An `Effect` is a stream based side-effect model that handles fetching data from remote APIs, working with WebSockets, and so on. In our case, it will:

1. Handle the loading of the `todos` (success and error scenarios)
2. Handle adding a `todo` item (success and error scenarios)
3. Handle removing a `todo` item (success and error scenarios)
4. Also handle the display of success/error messages

Let's write the class:

<code-example header="todos.effects.ts">
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';

import { ToastService } from '../services/toast.service';
import { TodosService } from '../services/todos.service';
import * as todos from '../actions/todos.actions';

@Injectable()
export class TodosEffects {
    
    // handle loading of the todos array
    loadTodos$ = createEffect(() =&gt; this.actions$.pipe(
        ofType(todos.loadToDos),
        mergeMap(() =&gt; this.todosService.getToDos().pipe(
            map(todos =&gt; todos.loadToDosSuccess({payload: todos})),
            catchError(error =&gt; of(todos.loadToDosError({payload: error}))),
        )),
    ));    
    
    // handle adding a todo item
    addTodo$ = createEffect(() =&gt; this.actions$.pipe(
        ofType(todos.addToDo),
        mergeMap(({payload}) =&gt; this.todosService.addToDo().pipe(
            map(createdToDo =&gt; todos.addToDoSuccess({payload: createdToDo})),
            catchError(error =&gt; of(todos.addToDosError({payload: error}))),
        )),
    ));  
    
    // handle removing a todo item
    addTodo$ = createEffect(() =&gt; this.actions$.pipe(
        ofType(todos.removeToDo),
        mergeMap(({payload}) =&gt; this.todosService.removeToDo().pipe(
            map(() =&gt; todos.removeToDoSuccess({payload})), // send the same id as we received
            catchError(error =&gt; of(todos.removeToDosError({payload: error}))),
        )),
    ));    
    
    // handle the success messages
    todoSuccessMessages$ = createEffect(() =&gt; this.actions$.pipe(
        ofType(todos.addToDoSuccess, todos.removeToDoSuccess), // we can handle multiple actions in an effect
        tap(message =&gt; this.toastService.displayErrorMessage(message))
    ), {dispatch: false}); // set dispatch: false as we do not need to map to another action, only perform a side effect   
    
    // handle the error messages
    todoSuccessMessages$ = createEffect(() =&gt; this.actions$.pipe(
        ofType(todos.addToDoSuccess, todos.removeToDoSuccess),
        tap(message =&gt; this.toastService.displaySuccessMessage(message))
    ), {dispatch: false}); 
    
    constructor(
        private readonly actions$: Actions,
        private readonly todosService: TodosService,
        private readonly toastService: ToastService,
    ) {}
}
</code-example>

As we can see, the `Effect` class registers several handlers for side effects based on `actions` using the `ofType` operator, makes an API call, and maps it to another `action` so that the `application state can be updated with the result of the side effect.

So we moved the most heavy part of the state management logic from the component to the effect: working with the remote API. We can now register our effect in `AppModule`:

<code-example header="app.module.ts">
@NgModule({
    // other metadata
    imports: [
        // other imports,
        EffectsModule.forRoot([TodosEffects]),
    ] 
})
</code-example>

Before we use the data in our component, one last step we have to take is to create a selector to actually get the `todos` list in the component. 

A [selector] is a pure function that maps our application state to a part of it (or another form of it) so that it can eb used in the component. 

Let's do this in `app/selectors/todos.selector.ts`:

<code-example header="todos.selectors.ts">
import { createFeatureSelector, createSelector } from '@ngrx/store';

const todos = createFeatureSelector('toDos');

export const allTodos = createSelector(todos, state =&gt; state.list);
</code-example>

Now let's start changing our component step-by-step to see how each piece of code maps to an "NgRx version" of it. Let's start by replacing the `ToDos` array with the actual array selected from the `Store`:

<code-example header="to-do-list.component.ts">
@Component({
  // component metadata
})
export class ToDoListComponent implements OnInit {
    todos$: this.store.select(fromTodos.allTodos);
    // instead of the todos array
    
    // other component code
}
</code-example>

Now this selected `todos$` is better, as it is selected from the store and is an `Observable` stream, so if any part of our application modifies it, we will instantly see the result in this component.

Now let's go on and change how the data is being loaded. Instead of directly calling the service API call method, we are going to notify the store that our component has been loaded, so that the side effect gets triggered and the data is loaded. Here is how it will look like:

<code-example header="to-do-list.component.ts">
@Component({
  // component metadata
})
export class ToDoListComponent implements OnInit {
    todos$: this.store.select(fromTodos.allTodos);
    
    constructor(
        private readonly store: Store,
    ) {}
    
    ngOnInit() {
        this.store.dispatch(fromTodos.loadToDos());
    }
    
    // other component code
}
</code-example>

So the component here does not actually know how and what data will be loaded, all it has to do is tell the store it is there and the rest is handled elsewhere, which is great for separation of concerns.

So what about modifying the state? Let's refactor our `addToDo` method, so that it dispatches an action instead of directly calling a service method:

<code-example header="to-do-list.component.ts">
@Component({
    selector: 'app-to-do-list',
    template: `
      &lt;div&gt;
        &lt;ul&gt;
          &lt;li *ngFor="let todo of (todos$ | async)"&gt;
            &lt;span&gt;{{ todo.text }}&lt;/span&gt;
            &lt;button (click)="removeTodo(todo.id)"&gt;X&lt;/button&gt;
          &lt;/li&gt;
        &lt;/ul&gt;
        &lt;div&gt;
          &lt;input #todoName placeholder="Add new To-Do Item"/&gt;
          &lt;button (click)="addToDo(#todoName.value)"&gt;Save To-Do Item&lt;/button&gt;
      &lt;/div&gt;
    `
})
export class ToDoListComponent implements OnInit {
    todos$: this.store.select(fromTodos.allTodos);
    
    constructor(
        private readonly store: Store,
    ) {}
    
    ngOnInit() {
        this.store.dispatch(fromTodos.loadToDos());
    }
    
    addToDo(toDoName: string) {
        this.store.dispatch(fromTodos.addToDo({payload: {name: toDoName}}));
    }
    
    // other component code
}
</code-example>

As you can see, our component is gradually becoming more and more simple. The last method we haven't refactored is the `removeTodo` moethod; so let's change it too and see how our component looks when using only NgRx:

<code-example header="to-do-list.component.ts">
@Component({
    selector: 'app-to-do-list',
    template: `
      &lt;div&gt;
        &lt;ul&gt;
          &lt;li *ngFor="let todo of (todos$ | async)"&gt;
            &lt;span&gt;{{ todo.text }}&lt;/span&gt;
            &lt;button (click)="removeTodo(todo.id)"&gt;X&lt;/button&gt;
          &lt;/li&gt;
        &lt;/ul&gt;
        &lt;div&gt;
          &lt;input #todoName placeholder="Add new To-Do Item"/&gt;
          &lt;button (click)="addToDo(#todoName.value)"&gt;Save To-Do Item&lt;/button&gt;
      &lt;/div&gt;
    `
})
export class ToDoListComponent implements OnInit {
    todos$: this.store.select(fromTodos.allTodos);
    
    constructor(
        private readonly store: Store,
    ) {}
    
    ngOnInit() {
        this.store.dispatch(fromTodos.loadToDos());
    }
    
    addToDo(toDoName: string) {
        this.store.dispatch(fromTodos.addToDo({payload: {name: toDoName}}));
    }
    
    removeToDo(toDoId: number) {
        this.store.dispatch(fromTodos.removeToDo({payload:toDoId}));
    }
}
</code-example>

As you can see, the `Store` now acts as a sort of a facade class, which separates the component from the application state, providing slices of state through selectors and allowing modifications via actions dispatchers. The refactoring took us N steps:

1. Abstract away the state handling logic into reducers and actions
2. Create selectors to access the state in the components
3. Move the API calls (side-effects) into `Effects` classes
4. Change the template a bit to use the `async` pipe

Main changes to our component at a glance are as follows:

1. Properties of the class are being mapped to `Observable` streams of data selected from the `Store`
2. Loading of the initial state of this component is done by dispatching an action
3. Any modifications that a particular component can do to the application state are also done via dispatching actions
4. Essentially the only thing components do is select data from the store and dispatch data to it, making them incredibly simple

And that is it. Using the same logic, we can refactor all the components in an application.

## Lazy Loading

Another concern is modules that are being lazy loaded. Usually, those modules have their own state, and it would not be beneficial to put their reducers/actions/effects/selectors in the global state, both uin terms of code quality (those files and classed will become extremely bloated) and in terms of performance/bundle size (no need to load and initialize parts of state that might never be accessed). 

So the next move after creating the application state is to take care about lazy-loaded feature states. Say we have an "admin" feature in the application, that is being lazy loaded separately. First, we can define it in out application interface:

<code-example header="state.ts">
export interface ToDosState {
    list: ToDo[];
}

export interface AdminState {
    // state that is related to the "admin" feature
}

export interface AppState {
    toDos: ToDosState;
    admin?: AdminState; // optional as at some point it can be undefined before the AdminModule is lazy loaded
}
</code-example>

Now we can create the same "state" folder with respective files (for reducer, actions,. effects and selectors) in the admin module directory, add all the relevant logic, and register it in the `AdminModule` class:

<code-example header="app.module.ts">
@NgModule({
    // other metadata
    imports: [
        // other imports,
        StoreModule.forFeature({admin: adminReducer}),
        EffectsModule.forRoot([AdminEffects]),
    ] 
})
export class AdminModule {}
</code-example>

We can then extend all those refactorings to all the lazy-loaded feature modules in our application. An important thing to remember is that the state from a lazy loaded module will be undefined if the user has not accessed those routes, meaning that if we would like to, say, use a piece of data from the `Admin` feature in the `To Do List Page`, we might encounter a problem if the user has not previously visited the `Admin Module`, thus meaning that data would probably better belong in the root state. So remember to take this into consideration when building lazy loaded features with NgRx.

## Further changes

If we are working with large lists of data performing different operations (adding one item, removing many items, updating many or one items and so on), then our application can also benefit from @ngrx/entity. A small example of how it can benefit our To-Do list application in the reducer:

<code-example header="reducer.ts">
import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { ToDosState, todosInitialState } from './state';
import * as todos './actions';

const todosAdapter = createEntityAdapter&lt;ToDo&gt;();

const _todosReducer = createReducer(
    todosAdapter.getInitialState(),
    on(todos.loadToDosSuccess, (state, action) =&gt; todosAdapter.setAll(state, action.payload)),
    on(todos.addToDoSuccess, (state, action) =&gt; todosAdapter.addOne(state, action.payload)),
    on(todos.removeToDoSuccess, (state, action) =&gt; todosAdapter.removeOne(state, action.payload)),
);

export function todosReducer(state: ToDosState, action: Action) {
    return _todosReducer(state, action);
}
</code-example>
With this, the reducer function looks way more organized and clean. You can read more about `@ngrx/entity` [here]
(https://ngrx.io/guide/entity).
