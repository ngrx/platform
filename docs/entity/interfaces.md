# Entity Interfaces

## EntityState<T>

The Entity State is a predefined generic interface for a given entity collection with the following properties:

 * `ids`: An array of all the primary ids in the collection
 * `entities`: A dictionary of entities in the collection indexed by the primary id

 Extend this interface to provided any additional properties for the entity state.

 Usage:

 ```ts
 export interface User {
  id: number;
  name: string;
  description: string;
}

export interface State extends EntityState<User> {
  // additional entity state properties
  selectedUserId: number | null;
}
```

## EntityAdapter<T>

Provides a generic type interface for the provided [entity adapter](./adapter.md#createentityadapter). The entity adapter provides many [collection methods](./adapter.md#adapter-collection-methods) for managing the entity state.

Usage:

```ts
export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id
});
```
