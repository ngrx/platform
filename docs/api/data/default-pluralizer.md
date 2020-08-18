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
