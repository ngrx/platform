---
kind: ClassDeclaration
name: StoreDevtoolsConfig
module: store-devtools
---

# StoreDevtoolsConfig

```ts
class StoreDevtoolsConfig {
  maxAge: number | false = false;
  monitor?: ActionReducer<any, any>;
  actionSanitizer?: ActionSanitizer;
  stateSanitizer?: StateSanitizer;
  name?: string;
  serialize?: boolean | SerializationOptions;
  logOnly?: boolean;
  features?: DevToolsFeatureOptions;
  actionsBlocklist?: string[];
  actionsSafelist?: string[];
  predicate?: Predicate;
}
```
