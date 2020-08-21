import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromAuth from './reducers';

@Component({
  selector: 'user-greeting',
  template: ` <div>Greetings, {{ username$ | async }}!</div> `,
})
export class UserGreetingComponent {
  username$ = this.store.pipe(select(fromAuth.getUsername));

  constructor(private store: Store<fromAuth.State>) {}
}
