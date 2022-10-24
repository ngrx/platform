import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ngrx-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>Welcome {{ title }}</h1>

    <a routerLink="/feature">Load Feature</a>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'ngrx-standalone-app';
}
