---
kind: ClassDeclaration
name: DefaultDataServiceConfig
module: data
---

# DefaultDataServiceConfig

## description

Optional configuration settings for an entity collection data service
such as the `DefaultDataService<T>`.

```ts
class DefaultDataServiceConfig {
  root?: string;
  entityHttpResourceUrls?: EntityHttpResourceUrls;
  delete404OK?: boolean;
  getDelay?: number;
  saveDelay?: number;
  timeout?: number;
}
```

[Link to repo](https://github.com/ngrx/platform/blob/master/modules/data/src/dataservices/default-data-service-config.ts#L7-L26)

## Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| root | `string` | /\*\*       |

- root path of the web api. may also include protocol, domain, and port
- for remote api, e.g.: `'https://api-domain.com:8000/api/v1'` (default: 'api')
  \*/ |
  | entityHttpResourceUrls | `EntityHttpResourceUrls` | /\*\*
- Known entity HttpResourceUrls.
- HttpUrlGenerator will create these URLs for entity types not listed here.
  _/ |
  | delete404OK | `boolean` | /\*\* Is a DELETE 404 really OK? (default: true) _/ |
  | getDelay | `number` | /** Simulate GET latency in a demo (default: 0) \*/ |
  | saveDelay | `number` | /** Simulate save method (PUT/POST/DELETE) latency in a demo (default: 0) _/ |
  | timeout | `number` | /\*\* request timeout in MS (default: 0)_/ |
