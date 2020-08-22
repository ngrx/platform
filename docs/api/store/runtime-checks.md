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

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/models.ts#L103-L130)
