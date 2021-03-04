# Example NgRx Data App

To serve the NgRx Data example app run `ng serve data-example-app`

The example app will be available at `http://localhost:4200/`

No backend is needed as the example app uses a fake backend implemented with an HTTP Interceptor (`fake-backened-interceptor.service.ts`) to
intercept requests and make the CRUD operations.
