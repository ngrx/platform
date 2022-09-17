import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { FeatureComponent } from './feature.component';
import { feature } from './feature.state';

export const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    providers: [provideState(feature)],
  },
];
