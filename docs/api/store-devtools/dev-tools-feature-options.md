---
kind: InterfaceDeclaration
name: DevToolsFeatureOptions
module: store-devtools
---

# DevToolsFeatureOptions

```ts
interface DevToolsFeatureOptions {
  pause?: boolean;
  lock?: boolean;
  persist?: boolean;
  export?: boolean;
  import?: 'custom' | boolean;
  jump?: boolean;
  skip?: boolean;
  reorder?: boolean;
  dispatch?: boolean;
  test?: boolean;
}
```
