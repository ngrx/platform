import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Credentials } from '@example-app/auth/models';
import * as fromAuth from '@example-app/auth/reducers';
import { LoginPageActions } from '@example-app/auth/actions/login-page.actions';
import { LoginFormComponent } from '../components';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-login-page',
  imports: [LoginFormComponent, AsyncPipe],
  template: `
    <bc-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending()"
      [errorMessage]="error()"
    >
    </bc-login-form>
  `,
})
export class LoginPageComponent {
  private readonly store = inject(Store);

  protected readonly pending = this.store.selectSignal(
    fromAuth.selectLoginPagePending
  );
  protected readonly error = this.store.selectSignal(
    fromAuth.selectLoginPageError
  );

  onSubmit(credentials: Credentials) {
    this.store.dispatch(LoginPageActions.login({ credentials }));
  }
}
