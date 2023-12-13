# Entity Management

`withEntities` is an extension to facilitate CRUD operations for managing entities. It shares similarities with @ngrx/entity but is part of the SignalStore.

It doesn't include methods for backend communication. You have to implement them separately.

## Creating the Store

A store implementing a `Todo` entity can have the following implementation:

```typescript
interface Todo {
  id: number;
  name: string;
  description: string;
}

const TodoStore = signalStore(withEntities<Todo>());
```

`withEntities` adds three properties of type `Signal` to the `TodoStore`.

- `ids: Signal<EntityId[]>`: ids of all entities
- `entities: Signal<Todo[]>`: array of all entities
- `entityMap: Signal<EntityMap<Todo>>`> map of entities where the key is the id (`EntityId`)

By default, `withEntities` requires your entity to have a property of name `id`, which serves as a unique identifier. `id` has to be of type `EntityId`, which is a `number` or a `string`.

## Adding & Setting

`addEntity` and `addEntities` add entries to the store. They act as updater functions for `patchState`.

Here is an example on how to use them inside a component.

```typescript
@Component({
  template: `@for (todo of todoStore.entities();track todo.id) {
    <ul>
      <li>{{ todo.name }}</li>
    </ul>
    }`,
  standalone: true,
  providers: [TodoStore],
})
export class EntityComponent implements OnInit {
  todoStore = inject(TodoStore);

  ngOnInit() {
    // add a single entity
    patchState(this.todoStore, addEntity({ id: 1, name: 'Car Washing', finished: false }));

    // add multiple entities
    patchState(
      this.todoStore,
      addEntities([
        { id: 2, name: 'Car Washing', finished: false },
        { id: 3, name: 'Room Cleaning', finished: false },
      ])
    );
  }
}
```

If you add an entity with an existing id, the original entity is not overwritten, and no error is thrown.

In this example, the todo remains as "Cat Feeding".

```typescript
patchState(this.todoStore, addEntity({ id: 1, name: 'Cat Feeding', finished: false }));

patchState(this.todoStore, addEntity({ id: 1, name: 'Dog Feeding', finished: false }));
```

---

To override existing entities, use `setEntity` or `setEntities`.

In this example, we add a new `Todo` entity with "Cat Feeding" and replace it with "Dog Feeding".

```typescript
patchState(this.todoStore, setEntity({ id: 1, name: 'Cat Feeding', finished: false }));

patchState(this.todoStore, setEntity({ id: 1, name: 'Dog Feeding', finished: false }));
```

## Updating & Removing

Updating and removing entities follow the same patterns as adding or setting them. The following functions are available:

- Updating: `updateEntity`, `updateEntities`
- Removing: `removeEntity`, `removeEntities`

No error is thrown If an entity does not exist. This rule applies to all update and remove functions.

The following example shows how to add, update, and remove an entity.

```typescript
patchState(
  this.todoStore,
  addEntities([
    { id: 2, name: 'Car Washing', finished: false },
    { id: 3, name: 'Cat Feeding', finished: false },
  ])
);

patchState(this.todoStore, updateEntity({ id: 2, changes: { finished: true } }));

patchState(this.todoStore, removeEntity(3));
```

`updateEntity` requires both parameters the `id` to update and its `changes` (`Partial<Todo>`). `removeEntity` only requires the `id`.

---

Here is the version for updating or removing all entities.

```typescript
patchState(
  this.todoStore,
  addEntities([
    { id: 2, name: 'Car Washing', finished: false },
    { id: 3, name: 'Cat Feeding', finished: false },
  ])
);

patchState(this.todoStore, updateAllEntities({ finished: true }));

patchState(this.todoStore, removeAllEntities());
```

For obvious reasons, no id is necessary for operations on all entities.

---

There is also an option to update or remove entities conditionally. We can provide an array of ids or a predicate. The predicate gets the entity as a parameter and needs to return a `boolean`.

```typescript
patchState(
  this.todoStore,
  addEntities([
    { id: 2, name: 'Car Washing', finished: false },
    { id: 3, name: 'Cat Feeding', finished: false },
  ])
);

patchState(
  this.todoStore,
  updateEntities({
    predicate: (todo) => Boolean(todo.name.match(/cat/i)),
    changes: { finished: true },
  })
);

patchState(
  this.todoStore,
  removeEntities((todo) => todo.finished)
);
```

For the predicate version, `updateEntities` requires an object literal with `predicate` and `changes`. `removeEntities` works with the simple predicate function.

Note that the predicate function needs to **explicitly** return `true` or `false`. A truthy or falsy value is incorrect.

The alternative version with an array of ids goes like this:

```typescript
patchState(
  this.todoStore,
  addEntities([
    { id: 2, name: 'Car Washing', finished: false },
    { id: 3, name: 'Cat Feeding', finished: false },
    { id: 4, name: 'Dog Feeding', finished: false },
  ])
);

patchState(
  this.todoStore,
  updateEntities({
    ids: [2, 3],
    changes: { finished: true },
  })
);

patchState(this.todoStore, removeEntities([2, 4]));
```

## Customized Id property

The default property name for an identifier is `id` and is of type `string` or `number`.

It is possible to specify a different name, but the type must still be `string` or `number`. You can specify the id only when adding or setting an entity. It is not possible to define it via `withEntities`.

Therefore, all variations of the `add*` and `set*` functions have an optional (last) parameter, which is an object literal and allows to define the id property via `idKey`.

For example:

```typescript
interface Todo {
  key: number;
  name: string;
  finished: boolean;
}

patchState(
  this.todoStore,
  addEntities(
    [
      { key: 2, name: 'Car Washing', finished: false },
      { key: 3, name: 'Cat Feeding', finished: false },
    ],
    { idKey: 'key' }
  )
);

patchState(this.todoStore, setEntity({ key: 4, name: 'Dog Feeding', finished: false }, { idKey: 'key' }));
```

The `update*` and `remove*` methods, which expect an id value, automatically pick the right one. That is possible because every entity belongs to a map with its id as the key.

Theoretically, adding the same entity twice with different id names would be possible. For obvious reasons, we discourage you from doing that.

## Multiple Entity Types / Named Entities

If you don't want to have the property names `ids`, `entities` and `entityMap` in the state, you can define others by providing a collection name.

Another use case is to have multiple entity types in one store. For example, `Todo` and `User`. In that case, you also have to come up with collections.

The following example shows a store that already has an `ids` property in its state before applying `withEntities`. Therefore, we provide the collection name `todo`.

```typescript
interface Todo {
  id: number;
  name: string;
  finished: boolean;
}

const TodoStore = signalStore(
  withState({ ids: [] }), // ids property already exists
  withEntities({ entity: type<Todo>(), collection: 'todo' })
);

@Component({
  selector: 'ngrx-entity',
  template: `@for (todo of todoStore.todoEntities(); track todo.id) {
    <p>Current Ids: {{ todoStore.todoIds() }}</p>
    <ul>
      <li [ngStyle]="{ 'font-weight': todo.finished ? 'bold' : 'normal' }">
        {{ todo.name }}
      </li>
    </ul>

    }`,
  standalone: true,
  providers: [TodoStore],
  imports: [NgStyle],
})
export class EntityComponent implements OnInit {
  todoStore = inject(TodoStore);

  ngOnInit() {
    patchState(
      this.todoStore,
      addEntities(
        [
          { id: 2, name: 'Car Washing', finished: false },
          { id: 3, name: 'Cat Feeding', finished: false },
        ],
        { collection: 'todo' }
      )
    );
  }
}
```

The names of the state properties changed from:

- `ids` -> `todoIds`
- `entities` -> `todoEntities`
- `entityMap` -> `todoEntityMap`

All functions that operate on entities require a collection parameter. Those are `add*`, `set*`, `update*`, and `remove*`. They are type-safe because you need to provide the collection to avoid getting a compilation error.

If you have a customized id property, you need to include the `idKey` parameter in the object literal, too:

```typescript
patchState(
  this.todoStore,
  addEntities(
    [
      { key: 2, name: 'Car Washing', finished: false },
      { key: 3, name: 'Cat Feeding', finished: false },
    ],
    { idKey: 'key', collection: 'todo' }
  )
);
```

To add multiple entities to a state, execute `withEntities` multiple times:

```typescript
const Store = signalStore(
  withEntities({ entity: type<Todo>(), collection: 'todo' }),
  withEntities({
    entity: type<User>(),
    collection: 'user',
  }),
  withEntities({ entity: type<Category>(), collection: 'category' })
);
```

Try to avoid multiple entity types in one store. It is better to have multiple stores, each with a single entity type.

## Extending and Integrating

You will usually want to persist your entities to a backend. Therefore, you must additionally implement `withMethods` and add the necessary methods.

```typescript
const TodoStore = signalStore(
  withEntities<Todo>(),
  withMethods((store) => {
    const todoService = inject(TodoService);

    return {
      async load() {
        const todos = await todoService.findAll();
        patchState(store, removeAllEntities());
        patchState(store, setEntities(todos));
      },

      async add(name: string) {
        const todo = await todoService.add(name);
        patchState(store, addEntity(todo));
      },

      async remove(id: number) {
        await todoService.remove(id);
        patchState(store, removeEntity(id));
      },

      async setFinished(id: number) {
        await todoService.setFinished(id);
        patchState(store, updateEntity({ id, changes: { finished: true } }));
      },
      async setUnfinished(id: number) {
        await todoService.setUnfinished(id);
        patchState(store, updateEntity({ id, changes: { finished: false } }));
      },
    };
  }),
  withHooks({ onInit: (store) => store.load() })
);
```

If your API follows the same pattern, you can even create your own `with*` function:

```typescript
interface EntityService<Entity> {
  findAll(): Promise<Entity[]>;

  add(name: string): Promise<Entity>;

  remove(id: number): Promise<void>;
}

function withPersistedEntities<Entity extends { id: number }>(EntityService: ProviderToken<EntityService<Entity>>) {
  return signalStoreFeature(
    withEntities<Entity>(),
    withMethods((store) => {
      const entityService = inject(EntityService);

      return {
        async load() {
          const entities = await entityService.findAll();
          patchState(store, removeAllEntities());
          patchState(store, setEntities(entities));
        },

        async add(name: string) {
          const entity = await entityService.add(name);
          patchState(store, addEntity(entity));
        },

        async remove(id: number) {
          await entityService.remove(id);
          patchState(store, removeEntity(id));
        },
      };
    })
  );
}

const TodoStore = signalStore(withPersistedEntities<Todo>(TodoService), withHooks({ onInit: (store) => store.load() }));
```

The `withPersistedEntities` uses internally `withEntities` and adds the communication with the API via requesting an `EntityService`.

For the `Todo` entity, we provide the `TodoService` and have a fully functional CRUD with a few lines of code.
