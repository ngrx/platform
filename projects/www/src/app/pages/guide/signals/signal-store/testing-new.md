# Testing

A SignalStore is an Angular service, so you test it like any other service. This guide assumes you are using Vitest; the same ideas apply to other test runners.

You can approach testing in three ways:

- **Test the store in isolation** by mocking its dependencies and exercising its API. When you do, never spy on the store’s methods - if a method grows complex, extract that logic into a service, call the service from the method, and mock or fake the service in the test.
- **Include the store in a wider test**, such as a full feature where both components and store are tested together.
- **Provide a fake or mock of the store** when testing a component or service that uses it.

Guiding principles:

- **Test the public API only.** Don’t assert on internal state or call internal methods; that ties tests to implementation and makes them brittle.
- **Use TestBed** when testing the store. It supplies dependency injection and the injection context that `rxMethod`, `inject()` inside `withMethods()`, and `withHooks()` need; instantiating the store with `new` won’t work for those.
