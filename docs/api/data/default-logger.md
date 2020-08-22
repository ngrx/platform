---
kind: ClassDeclaration
name: DefaultLogger
module: data
---

# DefaultLogger

```ts
class DefaultLogger implements Logger {
  error(message?: any, extra?: any);
  log(message?: any, extra?: any);
  warn(message?: any, extra?: any);
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-logger.ts#L4-L23)

## Methods

### error

```ts
error(message?: any, extra?: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-logger.ts#L6-L10)

#### Parameters (#error-parameters)

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| message | `any` |             |
| extra   | `any` |             |

### log

```ts
log(message?: any, extra?: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-logger.ts#L12-L16)

#### Parameters (#log-parameters)

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| message | `any` |             |
| extra   | `any` |             |

### warn

```ts
warn(message?: any, extra?: any);
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/default-logger.ts#L18-L22)

#### Parameters (#warn-parameters)

| Name    | Type  | Description |
| ------- | ----- | ----------- |
| message | `any` |             |
| extra   | `any` |             |
