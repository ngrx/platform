import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeatureActions, feature } from './feature.state';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>lazy component works!!</p>

    Feature State: {{ feature$ | async | json }}
  `,
})
export class FeatureComponent {
  feature$ = this.store.select(feature.selectFeatureState);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(FeatureActions.init());
  }
}
