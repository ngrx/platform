# Using ngrx/store in AngularJS

The _ngrx team_ has put efforts to made it possible, you can start using the
@ngrx/store during your AngularJS to Angular conversion.

## Downgrading Store service

If you want to **dispatch** an action or **select** some slice of your store
state, you will need to downgrade the Store service to use it in the AngularJS
parts of your application.

```ts
import { Store } from '@ngrx/store';
import { downgradeInjectable } from '@angular/upgrade/static';
import { module as ngModule } from 'angular';
// app
import { MyActionClass } from 'path/to.my/file.action';
import { mySelectorFunction } from 'path/to.my/file.selector';

// Using the `downgradeInjectable` to create the `ngrxStoreService` factory in AngularJS
ngModule('appName').factory('ngrxStoreService', downgradeInjectable(provider));

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
```
