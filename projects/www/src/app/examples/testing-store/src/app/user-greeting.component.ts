import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from './reducers';

@Component({
  selector: 'user-greeting',
  template: ` <div>Greetings, {{ username$ | async }}!</div> `,
})
export class UserGreetingComponent {
  username$ = this.store.select(fromAuth.getUsername);

  constructor(private store: Store<fromAuth.State>) {}
}
