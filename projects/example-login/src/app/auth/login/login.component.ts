import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../store/reducers/auth.reducer';
import * as AuthActions from '../store/actions/auth.actions';
import { selectLoginState, selectIsLoginState } from '../store/index';
import { Observable } from 'rxjs';
import { interval, timer } from 'rxjs';
import { delayWhen } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error$ = null;
  isLogging$ = false;
  constructor(private fb: FormBuilder, private store: Store<AuthState>) {}

  ngOnInit() {
    this.store.select(selectIsLoginState).subscribe(res => {
      this.isLogging$ = res;
    });
    this.loginForm = this.fb.group({
      account: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  login(formData) {
    this.store.dispatch(new AuthActions.IsLogin());

    const authData = {
      account: formData.account.trim(),
      password: formData.password.trim(),
    };

    this.store.dispatch(new AuthActions.Login(authData));

    // fake interact with api
    setTimeout(() => {
      this.store.dispatch(new AuthActions.LoginDone());
    }, 5000);

    this.store.select(selectIsLoginState).subscribe(res => {
      this.isLogging$ = res;
    });

    this.store.select(selectLoginState).subscribe(res => {
      if (res) {
        this.error$ = res;
      }
    });
  }
}
