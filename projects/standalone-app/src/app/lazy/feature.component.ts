import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FeatureActions, feature } from './feature.state';

@Component({
  selector: 'ngrx-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>lazy component works!!</p>

    Feature State: {{ feature$ | async | json }}
  `,
})
export class FeatureComponent implements OnInit {
  feature$ = this.store.select(feature.selectFeatureState);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(FeatureActions.init());
  }
}
