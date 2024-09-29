import { Routes } from '@angular/router';
import { LoginPageComponent } from '@example-app/auth/containers';

export default [
  {
    path: '',
    component: LoginPageComponent,
    data: { title: 'Login' },
  },
] satisfies Routes;
