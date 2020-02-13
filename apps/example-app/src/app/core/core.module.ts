import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@example-app/material';
import {
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
  ToolbarComponent,
} from '@example-app/core/components';
import {
  AppComponent,
  NotFoundPageComponent,
} from '@example-app/core/containers';

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
