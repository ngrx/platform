---
kind: ClassDeclaration
name: DefaultPluralizer
module: data
---

# DefaultPluralizer

```ts
class DefaultPluralizer {
  pluralNames: EntityPluralNames = {};

  pluralize(name: string);
  registerPluralNames(pluralNames: EntityPluralNames): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-pluralizer.ts#L17-L65)

## Methods

### pluralize

#### description (#pluralize-description)

Pluralize a singular name using common English language pluralization rules
Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"

```ts
pluralize(name: string);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-pluralizer.ts#L36-L56)

#### Parameters (#pluralize-parameters)

| Name | Type     | Description |
| ---- | -------- | ----------- |
| name | `string` |             |

### registerPluralNames

#### description (#registerPluralNames-description)

Register a mapping of entity type name to the entity name's plural

```ts
registerPluralNames(pluralNames: EntityPluralNames): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-pluralizer.ts#L62-L64)

#### Parameters (#registerPluralNames-parameters)

| Name        | Type                | Description                                       |
| ----------- | ------------------- | ------------------------------------------------- |
| pluralNames | `EntityPluralNames` | {EntityPluralNames} plural names for entity types |

## Parameters

| Name        | Type                | Description |
| ----------- | ------------------- | ----------- |
| pluralNames | `EntityPluralNames` |             |
