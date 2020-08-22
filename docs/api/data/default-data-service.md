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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L28-L195)

## Methods

### add

```ts
add(entity: T): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L65-L69)

#### Parameters (#add-parameters)

| Name   | Type | Description |
| ------ | ---- | ----------- |
| entity | `T`  |             |

### delete

```ts
delete(key: number | string): Observable<number | string>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L71-L80)

#### Parameters (#delete-parameters)

| Name | Type              | Description |
| ---- | ----------------- | ----------- |
| key  | `string | number` |             |

### getAll

```ts
getAll(): Observable<T[]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L82-L84)

### getById

```ts
getById(key: number | string): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L86-L92)

#### Parameters (#getById-parameters)

| Name | Type              | Description |
| ---- | ----------------- | ----------- |
| key  | `string | number` |             |

### getWithQuery

```ts
getWithQuery(queryParams: QueryParams | string): Observable<T[]>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L94-L101)

#### Parameters (#getWithQuery-parameters)

| Name        | Type                   | Description |
| ----------- | ---------------------- | ----------- |
| queryParams | `string | QueryParams` |             |

### update

```ts
update(update: Update<T>): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L103-L110)

#### Parameters (#update-parameters)

| Name   | Type  | Description |
| ------ | ----- | ----------- |
| update | `any` |             |

### upsert

```ts
upsert(entity: T): Observable<T>;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data.service.ts#L113-L117)

#### Parameters (#upsert-parameters)

| Name   | Type | Description |
| ------ | ---- | ----------- |
| entity | `T`  |             |
