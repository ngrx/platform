import { Component, input, output } from '@angular/core';
import { GroupNav } from '../services/contributors.service';

@Component({
  selector: 'ngrx-contributor-navigation',
  template: `
    <div class="groups-navigation">
      @for (group of groupNames(); track group.name) {
        <p
          (click)="selectGroup(group.name)"
          [class.selected]="selectedGroup() === group.name"
        >
          {{ group.name }}
        </p>
      }
    </div>
  `,
  styles: [
    `
      .groups-navigation {
        display: flex;
        background: var(--ngrx-bg-elevated);
        width: fit-content;
        padding: 5px;
        gap: 5px;
        margin-top: 50px;
        margin-bottom: 50px;
        border-radius: 5px;
      }
      .groups-navigation p {
        color: var(--ngrx-text-muted);
        padding: 2px 10px;
        cursor: pointer;
        margin: 0;
        border-radius: 2px;
        font-size: 18px;
      }
      .groups-navigation p.selected {
        background: var(--ngrx-bg-overlay);
        color: var(--ngrx-text);
      }
    `,
  ],
})
export class ContributorNavigationComponent {
  groupNames = input<GroupNav[]>();
  selectedGroup = input<string>();
  groupSelected = output<string>();

  selectGroup(name: string) {
    this.groupSelected.emit(name);
  }
}
