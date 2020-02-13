# Existing Projects

## Preface

This recipe will walk through migrating an existing project that uses a service based architecture over to NgRx for state management.

## Sample Application

The project that we will be converting [can be reached on GitHub here](https://github.com/andrewevans0102/to-do-with-ngrx). It is a basic "to-do list" that uses [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to store information.

It has a "to-do service" that creates, reads, updates, and deletes "to-do items." We're going to walkthrough converting the use of this service over to NgRx `Actions` and `Effects`. We will also be using the `create` functions along the way.

## Installing NgRx

So to start, first do a Git clone of the [project here](https://github.com/andrewevans0102/to-do-with-ngrx).

Go into the project's root directory and install the NgRx dependencies with the following:

```bash
cd to-do-with-ngrx
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools --save
```

Now with the dependencies installed, lets create the files that will hold our `actions`, `effects`, and `reducers`.

In the `src/app` folder create the following:

- ToDoActions.ts
- ToDoEffects.ts
- ToDoReducers.ts

Since this project is very small, we can get away with having single files like this. In a larger application, you may want to store your `actions`, `effects`, and `reducers` closer to the components that they support.

## Actions

First lets go over to the `src/app/ToDoActions.ts` file. Here is where we are going to house the project's actions.

Copy and paste the following:

```ts
import { createAction, props } from '@ngrx/store';
import { Item } from './models/item';

export const getItems = createAction('[to-do] get items');

export const loadItems = createAction(
  '[to-do] load items',
  props<{ items: Item[] }>()
);

export const addItem = createAction(
  '[to-do] add item',
  props<{ name: string }>()
);

export const deleteItem = createAction(
  '[to-do] delete item',
  props<{ item: Item }>()
);

export const errorItem = createAction(
  '[to-do] error item',
  props<{ message: string }>()
);
```

What is this doing? This is using the NgRx `create` functions to create ations for the different events the project will need to handle.

- `[to-do] load items` = action fires when the 'to-do' page loads
- `[to-do] add item` = action fires when we want to add a 'to-do'
- `[to-do] delete item` = action fires when we want to delete a 'to-do'
- `[to-do] error item` = action fires when an error is thrown

## Reducers

Ok so now that we've got our actions setup, lets go ahead and add reducers to our `ToDoReducers.ts` file.

Open the `ToDoReducers.ts` file and copy and paste the following:

```ts
import { loadItems, errorItem } from './ToDoActions';
import { on, createReducer } from '@ngrx/store';
import { Item } from './models/item';

export interface State {
  toDo: { items: Item[]; error: string };
}

export const initialState: State = {
  toDo: { items: [], error: '' }
};

export const ToDoReducer = createReducer(
  initialState,
  on(loadItems, (state, action) => ({
    ...state,
    items: action.items
  })),
  on(errorItem, (state, action) => ({
    ...state,
    error: action.message
  }))
);

export const selectItems = (state: State) => state.toDo.items;

export const selectError = (state: State) => state.toDo.error;
```

Here we have created a reducer for the `loadItems` action and the `errorItem` action. These handle state changes that occur when actions are fired off.

We've also defined `selectItems` and `selectError` selectors we will be using in our project. We will subscribe to those in the main component of the project.

## Effects

Ok so now let's add effects in our `ToDoEffects.ts` file. Open up the `ToDoEffects.ts` file and copy and paste the following:

```ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addItem, getItems, deleteItem } from './ToDoActions';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToDoService } from './services/to-do.service';

@Injectable()
export class ToDoEffect {
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getItems),
      switchMap(action => {
        const itemsLoaded = this.toDoService.getItems();
        return of({ type: '[to-do] load items', items: itemsLoaded });
      }),
      catchError(error => of({ type: '[to-do] error item', message: error }))
    )
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addItem),
      switchMap(action => {
        this.toDoService.addItem(action.name);
        const itemsLoaded = this.toDoService.getItems();
        return of({ type: '[to-do] load items', items: itemsLoaded });
      }),
      catchError(error => of({ type: '[to-do] error item', message: error }))
    )
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteItem),
      switchMap(action => {
        this.toDoService.deleteItem(action.item);
        const itemsLoaded = this.toDoService.getItems();
        return of({ type: '[to-do] load items', items: itemsLoaded });
      }),
      catchError(error => of({ type: '[to-do] error item', message: error }))
    )
  );

  constructor(private actions$: Actions, private toDoService: ToDoService) {}
}
```

Here we have defined effects for adding and deleting items. We've also created an effect that fires on the initial load of the application.

## Registering NgRx

So now we've defined our `actions`, `reducers`, and `effects` but we still need to register them in the `app.module` file.

Open the `app.module` file and copy and paste the following:

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { ToDoEffect } from './ToDoEffects';
import { StoreModule } from '@ngrx/store';
import { ToDoReducer } from './ToDoReducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ toDo: ToDoReducer }),
    EffectsModule.forRoot([ToDoEffect]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

In particular pay close attention to the following:

```ts
StoreModule.forRoot({ toDo: ToDoReducer }),
  EffectsModule.forRoot([ToDoEffect]),
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: environment.production
  });
```

Here we are registering the `StoreModule`, the `EffectsModule`, and the `StoreDevtoolsModule`. The `StoreDevtoolsModule` is not required, but it was added here so you could use that with the sample project. For more on the `StoreDevtoolsModule` please [refer to the guide here](https://ngrx.io/guide/store-devtools).

## Adding NgRx to the Component

The sample project is very simple and just has one component, but this was for simplicity with this guide. Obviously in real world applications you would have many more.

To connect the `actions`, `effects`, and `reducers` we're just going to modify the one `app.component`.

Open the `src/app/app.component` and add the following imports:

```ts
import { Store, select } from '@ngrx/store';
import { getItems, addItem, deleteItem } from './ToDoActions';
import { Observable } from 'rxjs';
import { selectItems, selectError } from './ToDoReducers';
```

Next add variables that we will use to subscribe to state. Also delete the original `items` variable since we will not be needing that anymore.

```ts
  // delete
  // items: Item[] = [];

  items$: Observable<any>;
  error$: Observable<any>;
```

Now redefine the `constructor` to:

1. have an instance of the `Store`
2. An initial `dispatch` to get the items into the project's state
3. Subscriptions to the `selectors` we created earlier so the application to interact with the data

```ts
// original
//   constructor(private toDoService: ToDoService) {
//     this.items = this.toDoService.getItems();
//   }

  constructor(private store: Store<{ toDo: { items: Item[] } }>) {
    this.store.dispatch(getItems());
    this.items$ = this.store.pipe(select(selectItems));
    this.error$ = this.store.pipe(select(selectError));
  }
```

Now redefine the `onSubmit` method so that items are created with a `dispatch` action rather than a manual call to the `to-do service`. You can also deleted the `addItem` method here in the component since the `effect` will call the `to-do service` for you.

```ts
// original
//   onSubmit() {
//     this.toDoService.addItem(this.toDoForm.controls.name.value);
//     this.items = this.toDoService.getItems();
//   }

 onSubmit() {
    this.store.dispatch(addItem({ name: this.toDoForm.controls.name.value }));
    this.toDoForm.controls.name.reset();
 }

// delete this
// addItem(name: string) {
//   this.toDoService.addItem(name);
// }

```

Finally, redefine the `deleteItem` method to dispatch an action rather than call the `to-do` service directly:

```ts
// original
//   deleteItem(item: Item) {
//     this.toDoService.deleteItem(item);
//     this.items = this.toDoService.getItems();
//   }

  deleteItem(deleted: Item) {
    this.store.dispatch(deleteItem({ item: deleted }));
  }
```

## Adding the Async Selectors to the Template

The last step is to modify the HTML template to use the observables rather than the direct link to the local array as was before. Modify the places in the HTML template that were linked to the `items` array like the following:

```html
<header class="c-header">
  <h1 class="c-header__title">To-Do list with NgRx</h1>
  <p class="c-header__subtitle">Learn how to use NgRx with a to-do list</p>
</header>
<!--Adding the seciton here to show errors-->
<section class="c-error" *ngIf="error$ | async as error">
  <h1>{{ error }}</h1>
</section>
<section class="c-error" *ngIf="error$ | async as error">
  <h1>{{ error }}</h1>
</section>
<form class="c-form" [formGroup]="toDoForm" (ngSubmit)="onSubmit()">
  <input
    class="c-form__input"
    type="text"
    formControlName="name"
    placeholder="to-do item"
    required
  />
  <button class="c-form__button" type="submit" [disabled]="!toDoForm.valid">
    Create Item
  </button>
</form>
<!-- removed the original section header to include an *ngIf to the NgRx observable here -->
<!-- <section class="c-list"> -->
<section class="c-list" *ngIf="items$ | async as items">
  <ul *ngFor="let item of items">
    <li class="c-list__item">
      <button class="c-list__button" (click)="deleteItem(item)">X</button>
      <span class="c-list__item-label">{{ item.name }}</span>
    </li>
  </ul>
</section>
```

## Wrapping Up

With all of the pieces in place, you should be able to view your the application running by running `npm run serve`. If you open the Redux DevTools you can also watch the events firing off and even do time travel.
