import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppComponent } from '@example-app/core/containers/app.component';
import { NotFoundPageComponent } from '@example-app/core/containers/not-found-page.component';
import { LayoutComponent } from '@example-app/core/components/layout.component';
import { NavItemComponent } from '@example-app/core/components/nav-item.component';
import { SidenavComponent } from '@example-app/core/components/sidenav.component';
import { ToolbarComponent } from '@example-app/core/components/toolbar.component';
import { MaterialModule } from '@example-app/material';

export const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent,
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
  ToolbarComponent,
];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {}
