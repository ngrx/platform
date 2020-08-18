---
kind: ClassDeclaration
name: CorrelationIdGenerator
module: data
---

# CorrelationIdGenerator

## description

Generates a string id beginning 'CRID',
followed by a monotonically increasing integer for use as a correlation id.
As they are produced locally by a singleton service,
these ids are guaranteed to be unique only
for the duration of a single client browser instance.
Ngrx entity dispatcher query and save methods call this service to generate default correlation ids.
Do NOT use for entity keys.

```ts
class CorrelationIdGenerator {
  next();
}
```
