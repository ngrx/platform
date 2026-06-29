# Resource Extensions

<ngrx-docs-alert type="inform">

The APIs from `@ngrx/signals/resource` are currently marked as experimental. This means its APIs are subject to change, and modifications may occur in future versions without standard breaking change announcements until it is deemed stable.

</ngrx-docs-alert>

Resource extensions are a set of utilities for customizing the behavior of an Angular `Resource` in a composable, reusable way. They wrap an existing resource and patch only the parts of its behavior that should change, while fully preserving the original resource type.

Two common requirements are not configurable at the resource level:

- **Value on loading** - when a resource reloads, `value()` resets to `undefined` until the new data arrives.
- **Value on error** - when a resource enters the error state, reading `value()` throws.

The `extendResource` function, together with the built-in extensions, addresses both cases without losing access to the APIs of more specific resource types, such as `WritableResource`.

## Extending a Resource

The `extendResource` function applies extensions to a resource and returns it with its original type preserved. It accepts the resource as the first argument, followed by the sequence of extensions.

<ngrx-code-example>

```ts
import { Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  extendResource,
  withPreviousValueOnLoading,
  withValueOnError,
} from '@ngrx/signals/resource';

@Component({
  /* ... */
})
export class TodoList {
  readonly todosResource = extendResource(
    httpResource<Todo[]>(() => `/api/todos`),
    withPreviousValueOnLoading(),
    withValueOnError(undefined)
  );
}
```

</ngrx-code-example>

## Built-in Extensions

Extensions are plain objects with a `type` symbol and an `apply` function that receives the resource and patches its behavior in place. When multiple applied extensions share the same `type`, the last one takes precedence.

### `withPreviousValueOnLoading`

Keeps the last resolved value while the resource is reloading, instead of resetting to `undefined`.

<ngrx-code-example>

```ts
import { signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import {
  extendResource,
  withPreviousValueOnLoading,
} from '@ngrx/signals/resource';

const page = signal(1);
const todosResource = extendResource(
  httpResource<Todo[]>(() => `/api/todos?page=${page()}`),
  withPreviousValueOnLoading()
);

// `value()` returns the previous page's data while the next page is loading,
// rather than `undefined`.
```

</ngrx-code-example>

### `withValueOnLoading`

Returns a specific fallback value while the resource is loading.

<ngrx-code-example>

```ts
import { httpResource } from '@angular/common/http';
import {
  extendResource,
  withValueOnLoading,
} from '@ngrx/signals/resource';

const todosResource = extendResource(
  httpResource<Todo[]>(() => `/api/todos`),
  withValueOnLoading([])
);

// `value()` returns `[]` on initial load and on every subsequent reload.
```

</ngrx-code-example>

### `withPreviousValueOnError`

Returns the last successfully resolved value when the resource enters the error state, instead of throwing.

<ngrx-code-example>

```ts
import { httpResource } from '@angular/common/http';
import {
  extendResource,
  withPreviousValueOnError,
} from '@ngrx/signals/resource';

const todosResource = extendResource(
  httpResource<Todo[]>(() => `/api/todos`),
  withPreviousValueOnError()
);

// If the request fails, `value()` returns whatever was successfully loaded
// before, rather than throwing an error.
```

</ngrx-code-example>

### `withValueOnError`

Returns a specific fallback value when the resource enters the error state, instead of throwing.

<ngrx-code-example>

```ts
import { httpResource } from '@angular/common/http';
import {
  extendResource,
  withValueOnError,
} from '@ngrx/signals/resource';

const todosResource = extendResource(
  httpResource<Todo[]>(() => `/api/todos`),
  withValueOnError([])
);

// If the request fails, `value()` returns `[]` instead of throwing.
```

</ngrx-code-example>

## Registering Global Extensions

The `provideResourceExtensions` function registers extensions for a given injector scope - application, route, or component. Every resource wrapped with `extendResource` within that scope automatically has the registered extensions applied.

<ngrx-code-example>

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideResourceExtensions,
  withValueOnError,
} from '@ngrx/signals/resource';

bootstrapApplication(App, {
  providers: [provideResourceExtensions(withValueOnError(undefined))],
});
```

</ngrx-code-example>

With global extensions in place, passing the resource directly to `extendResource` is enough to apply them:

```ts
@Component({
  /* ... */
})
export class TodoList {
  // Global extensions are applied automatically.
  readonly todosResource = extendResource(
    httpResource<Todo[]>(() => `/api/todos`)
  );
}
```

Per-resource extensions are appended after the global ones:

```ts
@Component({
  /* ... */
})
export class TodoList {
  // Global extensions run first, then `withPreviousValueOnLoading`.
  readonly todosResource = extendResource(
    httpResource<Todo[]>(() => `/api/todos`),
    withPreviousValueOnLoading()
  );
}
```

`provideResourceExtensions` is scope-aware and composes with extensions registered by parent injectors. Defaults can be layered at the application level and refined at the route or component level without discarding the parent configuration.
