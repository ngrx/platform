import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ResourceListModule } from 'app/custom-elements/resource/resource-list.module';

import { ResourcesComponent } from './resources.component';

const routes: Routes = [{ path: '', component: ResourcesComponent }];

@NgModule({
  declarations: [ResourcesComponent],
  imports: [CommonModule, ResourceListModule, RouterModule.forChild(routes)],
})
export class ResourcesModule {}
