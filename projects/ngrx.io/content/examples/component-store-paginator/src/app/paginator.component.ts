import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter, tap, withLatestFrom, map, pairwise } from 'rxjs/operators';

export interface PaginatorState {
  /** The current page index. */
  pageIndex: number;
  /** The current page size */
  pageSize: number;
  /** The current total number of items being paged */
  length: number;
  /** The set of provided page size options to display to the user. */
  pageSizeOptions: ReadonlySet<number>;
}

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export interface PageEvent
  extends Pick<PaginatorState, 'pageIndex' | 'pageSize' | 'length'> {
  /**
   * Index of the page that was selected previously.
   */
  previousPageIndex?: number;
}

@Component({
  selector: 'paginator',
  templateUrl: 'paginator.html',
  host: {
    'class': 'mat-paginator',
  },
  styleUrls: ['./paginator.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ComponentStore],
})
export class PaginatorComponent {
  @Input() set pageIndex(value: string | number) {
    this.setPageIndex(value);
  }

  @Input() set length(value: string | number) {
    this.componentStore.setState((state) => ({
      ...state,
      length: Number(value) || 0,
    }));
  }

  @Input() set pageSize(value: string | number) {
    this.componentStore.setState((state) => ({
      ...state,
      pageSize: Number(value) || 0,
    }));
  }

  @Input() set pageSizeOptions(value: readonly number[]) {
    this.componentStore.setState((state) => {
      // Making sure that the pageSize is included and sorted
      const pageSizeOptions = new Set<number>(
        [...value, state.pageSize].sort((a, b) => a - b)
      );
      return { ...state, pageSizeOptions };
    });
  }

  private readonly pageIndexChanges$ = this.componentStore.state$.pipe(
    // map instead of select, so that non-distinct value could go through
    map((state) => state.pageIndex),
    pairwise()
  );

  @Output() readonly page = this.componentStore.select(
    // first Observable 👇
    this.pageIndexChanges$,
    // second Observable 👇
    this.componentStore.select((state) => [state.pageSize, state.length]),
    // Now combining the results from both of these Observables into a PageEvent object
    ([previousPageIndex, pageIndex], [pageSize, length]) => ({
      pageIndex,
      previousPageIndex,
      pageSize,
      length,
    }),
    // debounce, so that we let the state "settle" before emitting a value
    { debounce: true }
  );

  // *********** Updaters *********** //

  readonly setPageIndex = this.componentStore.updater(
    (state, value: string | number) => ({
      ...state,
      pageIndex: Number(value) || 0,
    })
  );

  readonly changePageSize = this.componentStore.updater(
    (state, newPageSize: number) => {
      const startIndex = state.pageIndex * state.pageSize;
      return {
        ...state,
        pageSize: newPageSize,
        pageIndex: Math.floor(startIndex / newPageSize),
      };
    }
  );

  // *********** Selectors *********** //

  readonly hasPreviousPage$ = this.componentStore.select(
    ({ pageIndex, pageSize }) => pageIndex >= 1 && pageSize != 0
  );

  readonly numberOfPages$ = this.componentStore.select(
    ({ pageSize, length }) => {
      if (!pageSize) return 0;
      return Math.ceil(length / pageSize);
    }
  );

  readonly hasNextPage$ = this.componentStore.select(
    this.componentStore.state$,
    this.numberOfPages$,
    ({ pageIndex, pageSize }, numberOfPages) => {
      const maxPageIndex = numberOfPages - 1;
      return pageIndex < maxPageIndex && pageSize != 0;
    }
  );

  readonly rangeLabel$ = this.componentStore.select(
    ({ pageIndex, pageSize, length }) => {
      if (length == 0 || pageSize == 0) {
        return `0 of ${length}`;
      }
      length = Math.max(length, 0);

      const startIndex = pageIndex * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;

      return `${startIndex + 1} – ${endIndex} of ${length}`;
    }
  );

  // ViewModel of Paginator component
  readonly vm$ = this.componentStore.select(
    this.componentStore.state$,
    this.hasPreviousPage$,
    this.hasNextPage$,
    this.rangeLabel$,
    (state, hasPreviousPage, hasNextPage, rangeLabel) => ({
      pageSize: state.pageSize,
      pageSizeOptions: Array.from(state.pageSizeOptions),
      pageIndex: state.pageIndex,
      hasPreviousPage,
      hasNextPage,
      rangeLabel,
    })
  );

  // *********** Effects *********** //

  readonly lastPage = this.componentStore.effect((trigger$) => {
    return trigger$.pipe(
      withLatestFrom(this.numberOfPages$),
      tap(([, numberOfPages]) => {
        this.setPageIndex(numberOfPages - 1);
      })
    );
  });

  constructor(private readonly componentStore: ComponentStore<PaginatorState>) {
    // set defaults
    this.componentStore.setState({
      pageIndex: 0,
      pageSize: 50,
      length: 0,
      pageSizeOptions: new Set<number>([50]),
    });
  }
}
