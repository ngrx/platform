# @ngrx example application

Example application utilizing @ngrx libraries, showcasing common patterns and best practices.
Take a look at the [live app](https://ngrx.github.io/platform/example-app/).

This app is a book collection manager. The user can authenticate, use the Google Books API to search for
books and add them to their collection. This application utilizes [@ngrx/db](https://github.com/ngrx/db)
to persist the collection across sessions; [@ngrx/store](https://github.com/ngrx/store) to manage
the state of the app and to cache requests made to the Google Books API;
[@angular/router](https://github.com/angular/angular) to manage navigation between routes;
[@ngrx/effects](https://github.com/ngrx/effects) to isolate side effects.

Built with [@angular/cli](https://github.com/angular/angular-cli)

### Included
 - [@ngrx/store](https://github.com/ngrx/store) - RxJS powered state management for Angular apps, inspired by Redux
 - [@ngrx/effects](https://github.com/ngrx/effects) - Side effect model for @ngrx/store
 - [@angular/router](https://github.com/angular/angular) - Angular Router
 - [@ngrx/db](https://github.com/ngrx/db) - RxJS powered IndexedDB for Angular apps
 - [@ngrx/store-devtools](https://github.com/ngrx/store-devtools) - Instrumentation for @ngrx/store enabling time-travel debugging
 - [jest](https://facebook.github.io/jest/) - JavaScript test runner with easy setup, isolated browser testing and snapshot testing

### Quick start

```bash
# Clone the repository
git clone https://github.com/ngrx/platform.git

# Go to the example directory
cd platform

# Install the dependencies
yarn

# Start the server
yarn run build && yarn run cli -- serve

# Or try
yarn run example:start
```

Navigate to [http://localhost:4200/](http://localhost:4200/) in your browser. To login, the username and password is `test`.
 

_NOTE:_ The above setup instructions assume you have added local npm bin folders to your path.
If this is not the case you will need to install the Angular CLI globally.
