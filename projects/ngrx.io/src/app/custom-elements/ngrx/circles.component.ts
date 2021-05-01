import { Component } from '@angular/core';

@Component({
    selector: 'ngrx-circles',
    template: `
    <svg width="200px" height="200px" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g *ngFor="let circleGroup of circleGroups">
          <circle cx="8" cy="8" r="6"></circle>
          <circle cx="8" cy="182" r="6"></circle>
      </g>
    </svg>
  `,
})
export class CirclesComponent {
    circleGroups = new Array(9).fill(0);
}
