import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContributorGroup } from './contributors.model';
import { ContributorService } from './contributor.service';
import { LocationService } from 'app/shared/location.service';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'aio-contributor-list',
    template: `
  <div class="flex-center group-buttons">
    <a *ngFor="let name of groupNames"
       [class.selected]="name === selectedGroup.name"
       class="button mat-button filter-button"
       (click)="selectGroup(name)">{{name}}</a>
  </div>
  <section *ngIf="selectedGroup" class="grid-fluid">
    <div *ngIf="selectedGroup.name === 'Community'">
      <mat-paginator
        [length]="350"
        [pageIndex]="contributorPage$ | async"
        [pageSize]="100"
        [hidePageSize]="true"
        aria-label="Select page"
        (page)="changePage($event.pageIndex + 1)">
      </mat-paginator>
    </div>
    <div class="contributor-group">
      <aio-contributor *ngFor="let person of selectedGroup.contributors" [person]="person"></aio-contributor>
    </div>
  </section>`
})
export class ContributorListComponent implements OnInit, OnDestroy {
    private groups: ContributorGroup[];
    groupNames: string[];
    selectedGroup: ContributorGroup;
    contributorPage$: Observable<number>;
    destroy$ = new Subject<void>();

    constructor(
        private contributorService: ContributorService,
        private locationService: LocationService) { }

    ngOnInit() {
        this.contributorService.contributors
            .pipe(takeUntil(this.destroy$))
            .subscribe(grps => {
                const groupName = this.locationService.search()['group'] || '';
                this.groups = grps;
                this.groupNames = grps.map(g => g.name);
                this.selectGroup(groupName);
            });

        this.contributorPage$ = this.contributorService.currentContributorsPage$.pipe(
            map(page => page - 1)
        );
    }

    ngOnDestroy() {
        this.destroy$.next();
    }

    selectGroup(name: string) {
        name = name.toLowerCase();
        this.selectedGroup = this.groups.find(g => g.name.toLowerCase() === name) || this.groups[0];
        this.locationService.setSearch('', { group: this.selectedGroup.name });
    }

    changePage(page: number) {
        this.contributorService.updateContributorsCurrentPage(page);
    }
}
