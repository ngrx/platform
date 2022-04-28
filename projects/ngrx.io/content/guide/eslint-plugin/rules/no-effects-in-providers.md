# no-effects-in-providers

`Effect` should not be listed as a provider if it is added to the `EffectsModule`.

- **Type**: problem
- **Recommended**: Yes
- **Fixable**: Yes
- **Suggestion**: No
- **Requires type checking**: No
- **Configurable**: No

<!-- Everything above this generated, do not edit -->
<!-- MANUAL-DOC:START -->

## Rule Details

An effect class should only be added to the `EffectsModule` by using the `forRoot()` and `forFeature()` methods, **not** by adding the effect class to the Angular providers.

Examples of **incorrect** code for this rule:

With `forRoot`:

```ts
@NgModule({
  imports: [EffectsModule.forRoot([CustomersEffect])],
  providers: [CustomersEffect],
})
export class AppModule {}
```

With `forFeature`:

```ts
@NgModule({
  imports: [EffectsModule.forFeature([CustomersEffect])],
  providers: [CustomersEffect],
})
export class CustomersModule {}
```

Examples of **correct** code for this rule:

With `forRoot`:

```ts
@NgModule({
  imports: [EffectsModule.forRoot([CustomersEffect])],
})
export class AppModule {}
```

With `forFeature`:

```ts
@NgModule({
  imports: [EffectsModule.forFeature([CustomersEffect])],
})
export class CustomersModule {}
```

## Further reading

- [EffectsModule API](https://ngrx.io/api/effects/EffectsModule)
