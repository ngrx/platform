---
kind: ClassDeclaration
name: DefaultDataService
module: data
---

# DefaultDataService

## description

A basic, generic entity data service
suitable for persistence of most entities.
Assumes a common REST-y web API

```ts
class DefaultDataService<T> implements EntityCollectionDataService<T> {
  add(entity: T): Observable<T>;
  delete(key: number | string): Observable<number | string>;
  getAll(): Observable<T[]>;
  getById(key: number | string): Observable<T>;
  getWithQuery(queryParams: QueryParams | string): Observable<T[]>;
  update(update: Update<T>): Observable<T>;
  upsert(entity: T): Observable<T>;
}
```
