import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Authenticate } from '../models/user';

@Component({
  selector: 'bc-login-form',
  template: `
    <mat-card>
      <mat-card-title>Login</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <mat-input-container>
              <input type="text" matInput placeholder="Username" formControlName="username">
            </mat-input-container>
          </p>

          <p>
            <mat-input-container>
              <input type="password" matInput placeholder="Password" formControlName="password">
            </mat-input-container>
          </p>

          <p *ngIf="errorMessage" class="loginError">
            {{ errorMessage }}
          </p>

          <p class="loginButtons">
            <button type="submit" mat-button>Login</button>
          </p>

        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 72px 0;
    }

    .mat-form-field {
      width: 100%;
      min-width: 300px;
    }

    mat-card-title,
    mat-card-content {
      display: flex;
      justify-content: center;
    }

    .loginError {
      padding: 16px;
      width: 300px;
      color: white;
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
