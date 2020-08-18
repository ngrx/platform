---
kind: InterfaceDeclaration
name: RuntimeChecks
module: store
---

# RuntimeChecks

```ts
interface RuntimeChecks {
  strictStateSerializability: boolean;
  strictActionSerializability: boolean;
  strictStateImmutability: boolean;
  strictActionImmutability: boolean;
  strictActionWithinNgZone: boolean;
  strictActionTypeUniqueness?: boolean;
}
```
