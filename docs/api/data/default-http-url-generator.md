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
