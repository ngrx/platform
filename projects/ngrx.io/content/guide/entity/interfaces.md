# Entity Interfaces

## EntityState&lt;T&gt;

The Entity State is a predefined generic interface for a given entity collection with the following interface:

<code-example header="EntityState Interface">
interface EntityState&lt;V&gt; {
  ids: string[] | number[];
  entities: { [id: string | id: number]: V };
}
</code-example>

- `ids`: An array of all the primary ids in the collection
- `entities`: A dictionary of entities in the collection indexed by the primary id

Extend this interface to provide any additional properties for the entity state.

Usage:

<code-example header="user.reducer.ts">
export interface User {
  id: string;
  name: string;
}

export interface State extends EntityState&lt;User&gt; {
  // additional entity state properties
  selectedUserId: string | null;
}
</code-example>

## EntityAdapter&lt;T&gt;

Provides a generic type interface for the provided entity adapter. The entity adapter provides many collection methods for managing the entity state.

Usage:

<code-example header="user.reducer.ts">
export const adapter: EntityAdapter&lt;User&gt; = createEntityAdapter&lt;User&gt;();
</code-example>
