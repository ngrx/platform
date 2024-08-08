import { Routes } from '@angular/router';
import { LoginPageComponent } from '@example-app/auth/containers';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    data: { title: 'Login' },
  },
];
