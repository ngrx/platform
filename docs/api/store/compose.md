---
kind: FunctionDeclaration
name: compose
module: store
---

# compose

```ts
function compose(...functions: any[]);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L78-L89)

## Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| functions | `any[]` |             |

## Overloads

```ts
function compose<A>(): (i: A) => A;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L56-L56)

```ts
function compose<A, B>(b: (i: A) => B): (i: A) => B;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L57-L57)

### Parameters

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| b    | `(i: A) => B` |             |

```ts
function compose<A, B, C>(c: (i: B) => C, b: (i: A) => B): (i: A) => C;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L58-L58)

### Parameters

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| c    | `(i: B) => C` |             |
| b    | `(i: A) => B` |             |

```ts
function compose<A, B, C, D>(
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => D;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L59-L63)

### Parameters

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| d    | `(i: C) => D` |             |
| c    | `(i: B) => C` |             |
| b    | `(i: A) => B` |             |

```ts
function compose<A, B, C, D, E>(
  e: (i: D) => E,
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => E;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L64-L69)

### Parameters

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| e    | `(i: D) => E` |             |
| d    | `(i: C) => D` |             |
| c    | `(i: B) => C` |             |
| b    | `(i: A) => B` |             |

```ts
function compose<A, B, C, D, E, F>(
  f: (i: E) => F,
  e: (i: D) => E,
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => F;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L70-L76)

### Parameters

| Name | Type          | Description |
| ---- | ------------- | ----------- |
| f    | `(i: E) => F` |             |
| e    | `(i: D) => E` |             |
| d    | `(i: C) => D` |             |
| c    | `(i: B) => C` |             |
| b    | `(i: A) => B` |             |

```ts
function compose<A = any, F = any>(...functions: any[]): (i: A) => F;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/store/src/utils.ts#L77-L77)

### Parameters

| Name      | Type    | Description |
| --------- | ------- | ----------- |
| functions | `any[]` |             |
