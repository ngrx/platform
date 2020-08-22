---
kind: ClassDeclaration
name: Logger
module: data
---

# Logger

```ts
class Logger {
  abstract error(message?: any, ...optionalParams: any[]): void;
  abstract log(message?: any, ...optionalParams: any[]): void;
  abstract warn(message?: any, ...optionalParams: any[]): void;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/interfaces.ts#L3-L7)

## Methods

### error

```ts
abstract error(message?: any, ...optionalParams: any[]): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/interfaces.ts#L4-L4)

#### Parameters (#error-parameters)

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| message        | `any`   |             |
| optionalParams | `any[]` |             |

### log

```ts
abstract log(message?: any, ...optionalParams: any[]): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/interfaces.ts#L5-L5)

#### Parameters (#log-parameters)

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| message        | `any`   |             |
| optionalParams | `any[]` |             |

### warn

```ts
abstract warn(message?: any, ...optionalParams: any[]): void;
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/utils/interfaces.ts#L6-L6)

#### Parameters (#warn-parameters)

| Name           | Type    | Description |
| -------------- | ------- | ----------- |
| message        | `any`   |             |
| optionalParams | `any[]` |             |
