---
kind: ClassDeclaration
name: DefaultHttpUrlGenerator
module: data
---

# DefaultHttpUrlGenerator

```ts
class DefaultHttpUrlGenerator implements HttpUrlGenerator {
  entityResource(entityName: string, root: string): string;
  collectionResource(entityName: string, root: string): string;
  registerHttpResourceUrls(
    entityHttpResourceUrls: EntityHttpResourceUrls
  ): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L61-L130)

## Methods

### entityResource

#### description (#entityResource-description)

Create the path to a single entity resource

```ts
entityResource(entityName: string, root: string): string;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L102-L104)

#### Parameters (#entityResource-parameters)

| Name       | Type     | Description                                          |
| ---------- | -------- | ---------------------------------------------------- |
| entityName | `string` | {string} Name of the entity type, e.g, 'Hero'        |
| root       | `string` | {string} Root path to the resource, e.g., 'some-api` |

#### returns (#entityResource-returns)

complete path to resource, e.g, 'some-api/hero'

### collectionResource

#### description (#collectionResource-description)

Create the path to a multiple entity (collection) resource

```ts
collectionResource(entityName: string, root: string): string;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L112-L114)

#### Parameters (#collectionResource-parameters)

| Name       | Type     | Description                                          |
| ---------- | -------- | ---------------------------------------------------- |
| entityName | `string` | {string} Name of the entity type, e.g, 'Hero'        |
| root       | `string` | {string} Root path to the resource, e.g., 'some-api` |

#### returns (#collectionResource-returns)

complete path to resource, e.g, 'some-api/heroes'

### registerHttpResourceUrls

#### description (#registerHttpResourceUrls-description)

Register known single-entity and collection resource URLs for HTTP calls

```ts
registerHttpResourceUrls(  entityHttpResourceUrls: EntityHttpResourceUrls ): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L122-L129)

#### Parameters (#registerHttpResourceUrls-parameters)

| Name                   | Type                     | Description                                                           |
| ---------------------- | ------------------------ | --------------------------------------------------------------------- |
| entityHttpResourceUrls | `EntityHttpResourceUrls` | {EntityHttpResourceUrls} resource urls for specific entity type names |
