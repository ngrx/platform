# Entity Interfaces

## EntityState<T>

The @ngrx/entity!EntityState:interface interface is a predefined generic interface for a given entity collection with the following interface:

<ngrx-code-example header="EntityState Interface">

```ts
interface EntityState<V> {
  ids: string[] | number[];
  entities: { [id: string | id: number]: V };
}
```

</ngrx-code-example>

- `ids`: An array of all the primary ids in the collection
- `entities`: A dictionary of entities in the collection indexed by the primary id

Extend this interface to provide any additional properties for the entity state.

Usage:

<ngrx-code-example header="user.reducer.ts">

```ts
export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState<User> {
  // additional entity state properties
  selectedUserId: string | null;
}
```

</ngrx-code-example>

## EntityAdapter<T>

Provides a generic type interface for the provided entity adapter. The entity adapter provides many collection methods for managing the entity state.

Usage:

<ngrx-code-example header="user.reducer.ts">

```ts
export const adapter: EntityAdapter<User> =
  createEntityAdapter<User>();
```

</ngrx-code-example>
