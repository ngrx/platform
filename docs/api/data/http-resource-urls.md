---
kind: InterfaceDeclaration
name: HttpResourceUrls
module: data
---

# HttpResourceUrls

## description

Resource URLS for HTTP operations that target single entity
and multi-entity endpoints.

```ts
interface HttpResourceUrls {
  entityResourceUrl: string;
  collectionResourceUrl: string;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/http-url-generator.ts#L18-L33)
