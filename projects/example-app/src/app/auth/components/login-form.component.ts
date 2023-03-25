import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Credentials } from '@example-app/auth/models';

@Component({
  selector: 'bc-login-form',
  template: `
    <mat-card>
      <mat-card-title>Login</mat-card-title>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <mat-form-field>
              <input
                type="text"
                matInput
                placeholder="Username"
                formControlName="username"
              />
            </mat-form-field>
          </p>

          <p>
            <mat-form-field>
              <input
                type="password"
                matInput
                placeholder="Password"
                formControlName="password"
              />
            </mat-form-field>
          </p>

          <p *ngIf="errorMessage" class="login-error">
            {{ errorMessage }}
          </p>

          <div class="login-buttons">
            <button type="submit" mat-button>Login</button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin: 4.5rem 0;
      }

      .mat-mdc-form-field {
        width: 100%;
        min-width: 300px;
      }

      mat-card-title {
        text-align: center;
        margin: 1rem 0;
      }

      mat-card-content {
        justify-content: center;
      }

      .login-error {
        padding: 1rem;
        width: 300px;
        color: white;
        background-color: red;
      }

      .login-buttons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    `,
  ],
})
export class LoginFormComponent {
  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  @Input() errorMessage!: string | null;

  @Output() submitted = new EventEmitter<Credentials>();

  form: FormGroup = new FormGroup({
    username: new FormControl('ngrx'),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }
}
