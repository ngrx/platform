import { PortalComponent } from './portal/portal.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '@shared/notfound/notfound.component';
import { LoginComponent } from '@app/auth';
import { PortalModule } from './portal/portal.module';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'account/login',
    pathMatch: 'full',
  },
  {
    path: 'account/login',
    component: LoginComponent,
  },
  {
    path: 'portal',
    component: PortalComponent,
  },
  {
    path: '**',
    redirectTo: '/notfound',
    pathMatch: 'full',
  },
  {
    path: 'notfound',
    component: NotfoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
