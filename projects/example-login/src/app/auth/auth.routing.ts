import { LoginComponent } from './index';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';

const accountRoutes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
];

export const AccountRouting = RouterModule.forChild(accountRoutes);
