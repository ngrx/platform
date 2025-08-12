import { Component } from '@angular/core';

@Component({
  selector: 'ngrx-app-root',
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
  `,
})
export class AppComponent {
  name = 'Angular';
}
