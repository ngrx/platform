# Using Store in AngularJS

If you are working on an AngularJS to Angular conversion, you can use
`@ngrx/store` to provide global state to your hybrid application.

## Downgrading Store service

If you want to **dispatch** an action or **select** some slice of your store
state, you will need to downgrade the Store service to use it in the AngularJS
parts of your application.

<code-example header="app.module.js">
import { Store } from '@ngrx/store';
import { downgradeInjectable } from '@angular/upgrade/static';
import { module as ngModule } from 'angular';
// app
import { MyActionClass } from 'path/to.my/file.action';
import { mySelectorFunction } from 'path/to.my/file.selector';

// Using the `downgradeInjectable` to create the `ngrxStoreService` factory in AngularJS
ngModule('appName').factory('ngrxStoreService', downgradeInjectable(Store));

// AngularJS controller
export default ngModule('appName').controller('AngularJSController', [
  '$scope',
  '$controller',
  'ngrxStoreService',
  function($scope, $controller, ngrxStoreService) {
    // ...
    ngrxStoreService.dispatch(new MyActionClass(myPayload));
    ngrxStoreService.select(mySelectorFunction).subscribe(/*...*/);
    // ...
  },
]);
</code-example>
