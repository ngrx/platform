import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ContributorListComponent } from './contributor-list.component';
import { ContributorService } from './contributor.service';
import { ContributorComponent } from './contributor.component';
import { WithCustomElementComponent } from '../element-registry';

@NgModule({
    imports: [CommonModule],
    exports: [ContributorComponent],
    declarations: [ ContributorComponent],
})
export class ContributorModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = ContributorComponent;
}

@NgModule({
    imports: [CommonModule, MatPaginatorModule, ContributorModule],
    declarations: [ContributorListComponent],
    providers: [ContributorService],
})
export class ContributorListModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = ContributorListComponent;
}

