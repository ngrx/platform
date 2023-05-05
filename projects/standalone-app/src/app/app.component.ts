import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ComponentStore,
  INITIAL_STATE_TOKEN,
  provideComponentStore,
} from '@ngrx/component-store';
import { TestPipe } from './test.pipe';

@Component({
  selector: 'ngrx-root',
  standalone: true,
  imports: [RouterModule, TestPipe],
  template: `
    <h1>Welcome {{ title }} {{ val() }}</h1>

    <a routerLink="/feature">Load Feature</a>

    {{ 3 | test }}

    <router-outlet></router-outlet>
  `,
  providers: [
    provideComponentStore(ComponentStore),
    { provide: INITIAL_STATE_TOKEN, useValue: { test: true } },
  ],
})
export class AppComponent {
  title = 'ngrx-standalone-app';
  cs = inject(ComponentStore<{ test: number }>);
  num = signal(1);
  val = this.cs.selectSignal((s) => s.test);

  ngOnInit() {
    this.num.set(2);
  }
}
