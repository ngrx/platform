import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Authenticate } from '../models/user';

@Component({
  selector: 'bc-login-form',
  template: `
    <md-card>
      <md-card-title>Login</md-card-title>
      <md-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <md-input-container>
              <input type="text" mdInput placeholder="Username" formControlName="username">
            </md-input-container>
          </p>

          <p>
            <md-input-container>
              <input type="password" mdInput placeholder="Password" formControlName="password">
            </md-input-container>
          </p>

          <p *ngIf="errorMessage" class="loginError">
            {{ errorMessage }}
          </p>          
        
          <p class="loginButtons">
            <button type="submit" md-button>Login</button>
          </p>

        </form>
      </md-card-content>
    </md-card>
  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 72px 0;
    }

    md-card-title,
    md-card-content {
      display: flex;
      justify-content: center;
    }

    input {
      width: 300px;
    }

    .loginError {
      padding: 16px;
      width: 300px;
      font-color: white;
      background-color: red;
    }

    .loginButtons {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  `,
  ],
})
export class LoginFormComponent implements OnInit {
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Input() errorMessage: string | null;

  @Output() submitted = new EventEmitter<Authenticate>();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() {}

  ngOnInit() {}

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }
}
