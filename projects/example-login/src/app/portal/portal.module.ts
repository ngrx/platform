import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PortalComponent } from './portal.component';
import { PortalRouting } from './portal.routing';
@NgModule({
  imports: [CommonModule, PortalRouting],
  declarations: [PortalComponent],
  exports: [],
  providers: [],
})
export class PortalModule {}
