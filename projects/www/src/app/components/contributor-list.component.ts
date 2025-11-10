import { Component, input } from '@angular/core';
import { ContributorCardComponent } from './contributor-card.component';
import { Contributor } from '../services/contributors.service';

@Component({
  selector: 'ngrx-contributor-list',
  imports: [ContributorCardComponent],
  template: `
    @if (contributors() && contributors().length > 0) {
    <div class="contributor-list">
      @for (contributor of contributors(); track contributor.name) {
      <ngrx-contributor-card
        [contributor]="contributor"
      ></ngrx-contributor-card>
      }
    </div>
    } @else {
    <p>No contributors found</p>
    }
  `,
  styles: [
    `
      .contributor-list {
        margin-top: 30px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 50px;
        justify-items: center;
        width: 900px;
        max-width: 100%;
        @media only screen and (max-width: 900px) {
          grid-template-columns: repeat(3, 1fr);
        }
        @media only screen and (max-width: 600px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media only screen and (max-width: 480px) {
          grid-template-columns: repeat(1, 1fr);
        }
      }
    `,
  ],
})
export class ContributorListComponent {
  contributors = input<Contributor[]>([]);
}
