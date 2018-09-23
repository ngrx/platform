import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

const portalRoutes: Routes = [
  {
    path: '',
    component: PortalComponent,
  },
];

export const PortalRouting = RouterModule.forChild(portalRoutes);
