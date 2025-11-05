import { Component, inject, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ContributorGroup,
  ContributorsService,
} from '../services/contributors.service';
import { ContributorNavigationComponent } from '../components/contributor-navigation.component';
import { ContributorListComponent } from '../components/contributor-list.component';
import { map, shareReplay, startWith } from 'rxjs';

@Component({
  selector: 'ngrx-about-page',
  imports: [ContributorNavigationComponent, ContributorListComponent],
  template: `
    <div class="page">
      <h1>NgRx Team</h1>

      <ngrx-contributor-navigation
        [groupNames]="groupNames()"
        [selectedGroup]="filterTerm()"
        (groupSelected)="setGroup($event)"
      />

      <ngrx-contributor-list [contributors]="selectedGroup()" />
    </div>
  `,
  styles: [
    `
      .page {
        padding: 32px;
      }
      .page h1 {
        margin-top: 35px;
      }
    `,
  ],
})
export default class AboutPageComponent {
  private contributorService = inject(ContributorsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private contributors = toSignal(
    this.contributorService.getContributors().pipe(shareReplay(1)),
    { initialValue: [] as ContributorGroup[] }
  );

  filterTerm = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('group') || 'Core'),
      startWith('Core')
    ),
    { initialValue: 'Core' }
  );

  groupNames = computed(() =>
    this.contributors().map((g) => ({ name: g.name, order: g.order }))
  );

  selectedGroup = computed(() => {
    const groups = this.contributors();
    const term = this.filterTerm();
    const group = groups.find((g) => g.name === term);
    return group ? group.contributors : [];
  });

  setGroup(name: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { group: name },
      queryParamsHandling: 'merge',
    });
  }
}
