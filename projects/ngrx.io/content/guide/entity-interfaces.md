# Entity Interfaces

## EntityState<T>

The Entity State is a predefined generic interface for a given entity collection with the following interface:

```ts
interface EntityState<V> {
  ids: string[] | number[];
  entities: { [id: string | id: number]: V };
}
```

- `ids`: An array of all the primary ids in the collection
- `entities`: A dictionary of entities in the collection indexed by the primary id

Extend this interface to provided any additional properties for the entity state.

Usage:

```ts
export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState<User> {
  // additional entity state properties
  selectedUserId: number | null;
}
```

## EntityAdapter<T>

Provides a generic type interface for the provided entity adapter. The entity adapter provides many collection methods for managing the entity state.

Usage:

```ts
export const adapter: EntityAdapter<User> = createEntityAdapter<User>();
```
