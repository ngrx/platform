import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LoginPageComponent } from '@example-app/auth/containers';
import {
  LoginFormComponent,
  LogoutConfirmationDialogComponent,
} from '@example-app/auth/components';

import { AuthEffects } from '@example-app/auth/effects';
import { reducers } from '@example-app/auth/reducers';
import { MaterialModule } from '@example-app/material';
import { AuthRoutingModule } from '@example-app/auth';

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
