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
