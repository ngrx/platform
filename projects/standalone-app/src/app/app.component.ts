import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import {
  ComponentStore,
  INITIAL_STATE_TOKEN,
  provideComponentStore,
} from '@ngrx/component-store';

@Component({
  selector: 'ngrx-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>Welcome {{ title }} {{ val() }}</h1>

    <a routerLink="/feature">Load Feature</a>

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
  num2 = of(2);
  val = this.cs.selectSignal((s) => s.test);
  listener = this.cs.effect((trigger$) => {
    return trigger$.pipe(tap(console.log));
  });
  listener2 = this.cs.effect<number>((trigger$) => {
    return trigger$.pipe(tap(console.log));
  });

  ngOnInit() {
    this.listener(this.num);
    this.listener2(this.num2);
    this.num.set(2);
  }
}
