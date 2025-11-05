import { Component, input, Input } from '@angular/core';
import { ContributorCardComponent } from './contributor-card.component';
import { Contributor } from '../services/contributors.service';

@Component({
  selector: 'contributor-list',
  standalone: true,
  imports: [ContributorCardComponent],
  template: `
    @if (contributors() && contributors().length > 0) {
    <div class="contributor-list">
      @for (contributor of contributors(); track contributor.name) {
      <contributor-card [contributor]="contributor"></contributor-card>
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
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 24px;
        margin-bottom: 50px;
        justify-items: center;
      }
    `,
  ],
})
export class ContributorListComponent {
  contributors = input<Contributor[]>([]);
}
