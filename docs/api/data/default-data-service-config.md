---
kind: ClassDeclaration
name: DefaultDataServiceConfig
module: data
---

# DefaultDataServiceConfig

## description

Optional configuration settings for an entity collection data service
such as the `DefaultDataService<T>`.

```ts
class DefaultDataServiceConfig {
  root?: string;
  entityHttpResourceUrls?: EntityHttpResourceUrls;
  delete404OK?: boolean;
  getDelay?: number;
  saveDelay?: number;
  timeout?: number;
}
```
