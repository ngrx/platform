---
kind: ClassDeclaration
name: HttpUrlGenerator
module: data
---

# HttpUrlGenerator

## description

Generate the base part of an HTTP URL for
single entity or entity collection resource

```ts
class HttpUrlGenerator {
  abstract entityResource(entityName: string, root: string): string;
  abstract collectionResource(entityName: string, root: string): string;
  abstract registerHttpResourceUrls(
    entityHttpResourceUrls?: EntityHttpResourceUrls
  ): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L39-L59)

## Methods

### entityResource

#### description (#entityResource-description)

Return the base URL for a single entity resource,
e.g., the base URL to get a single hero by its id

```ts
abstract entityResource(entityName: string, root: string): string;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L44-L44)

#### Parameters (#entityResource-parameters)

| Name       | Type     | Description |
| ---------- | -------- | ----------- |
| entityName | `string` |             |
| root       | `string` |             |

### collectionResource

#### description (#collectionResource-description)

Return the base URL for a collection resource,
e.g., the base URL to get all heroes

```ts
abstract collectionResource(entityName: string, root: string): string;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L50-L50)

#### Parameters (#collectionResource-parameters)

| Name       | Type     | Description |
| ---------- | -------- | ----------- |
| entityName | `string` |             |
| root       | `string` |             |

### registerHttpResourceUrls

#### description (#registerHttpResourceUrls-description)

Register known single-entity and collection resource URLs for HTTP calls

```ts
abstract registerHttpResourceUrls(  entityHttpResourceUrls?: EntityHttpResourceUrls ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L56-L58)

#### Parameters (#registerHttpResourceUrls-parameters)

| Name                   | Type                     | Description                                                           |
| ---------------------- | ------------------------ | --------------------------------------------------------------------- |
| entityHttpResourceUrls | `EntityHttpResourceUrls` | {EntityHttpResourceUrls} resource urls for specific entity type names |
