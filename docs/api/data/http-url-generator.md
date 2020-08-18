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
