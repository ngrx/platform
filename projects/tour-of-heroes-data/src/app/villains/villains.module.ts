import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { VillainDetailComponent } from './villain-detail/villain-detail.component';
import { VillainListComponent } from './villain-list/villain-list.component';
import { VillainsComponent } from './villains/villains.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: VillainsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ],
  exports: [VillainsComponent, VillainDetailComponent],
  declarations: [
    VillainsComponent,
    VillainDetailComponent,
    VillainListComponent,
  ],
})
export class VillainsModule {}
