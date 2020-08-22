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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store-devtools/src/config.ts#L27-L39)

## Parameters

| Name             | Type                             | Description |
| ---------------- | -------------------------------- | ----------- |
| maxAge           | `number | false`                 |             |
| monitor          | `any`                            |             |
| actionSanitizer  | `ActionSanitizer`                |             |
| stateSanitizer   | `StateSanitizer`                 |             |
| name             | `string`                         |             |
| serialize        | `boolean | SerializationOptions` |             |
| logOnly          | `boolean`                        |             |
| features         | `DevToolsFeatureOptions`         |             |
| actionsBlocklist | `string[]`                       |             |
| actionsSafelist  | `string[]`                       |             |
| predicate        | `Predicate`                      |             |
