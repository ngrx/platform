import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LoginPageComponent } from '@example-app/auth/containers/login-page.component';
import { LoginFormComponent } from '@example-app/auth/components/login-form.component';
import { LogoutConfirmationDialogComponent } from '@example-app/auth/components/logout-confirmation-dialog.component';

import { AuthEffects } from '@example-app/auth/effects/auth.effects';
import { reducers } from '@example-app/auth/reducers';
import { MaterialModule } from '@example-app/material';
import { AuthRoutingModule } from '@example-app/auth/auth-routing.module';

export const COMPONENTS = [
  LoginPageComponent,
  LoginFormComponent,
  LogoutConfirmationDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: COMPONENTS,
  entryComponents: [LogoutConfirmationDialogComponent],
})
export class AuthModule {}
