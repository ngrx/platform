import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { PaginatorStore } from './paginator.store';

@Component({
  selector: 'paginator',
  templateUrl: 'paginator.html',
  host: {
    'class': 'mat-paginator',
  },
  styleUrls: ['./paginator.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaginatorStore],
})
export class PaginatorComponent {
  // #docregion inputs
  @Input() set pageIndex(value: string | number) {
    this.paginatorStore.setPageIndex(value);
  }

  @Input() set length(value: string | number) {
    this.paginatorStore.setLength(value);
  }

  @Input() set pageSize(value: string | number) {
    this.paginatorStore.setPageSize(value);
  }

  @Input() set pageSizeOptions(value: readonly number[]) {
    this.paginatorStore.setPageSizeOptions(value);
  }
  // #enddocregion inputs

  // #docregion selectors
  // Outputing the event directly from the page$ Observable<PageEvent> property.
  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page = this.paginatorStore.page$;

  // ViewModel for the PaginatorComponent
  readonly vm$ = this.paginatorStore.vm$;
  // #enddocregion selectors

  constructor(private readonly paginatorStore: PaginatorStore) {}

  // #docregion updating-state
  changePageSize(newPageSize: number) {
    this.paginatorStore.changePageSize(newPageSize);
  }
  nextPage() {
    this.paginatorStore.nextPage();
  }
  firstPage() {
    this.paginatorStore.firstPage();
  }
  previousPage() {
    this.paginatorStore.previousPage();
  }
  lastPage() {
    this.paginatorStore.lastPage();
  }
  // #enddocregion updating-state
}
