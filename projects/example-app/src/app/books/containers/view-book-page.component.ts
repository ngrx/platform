import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { ViewBookPageActions } from '@example-app/books/actions/view-book-page.actions';
import { SelectedBookPageComponent } from './selected-book-page.component';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Book Page's responsibility is to map router params
 * to a 'Select' book action. Actually showing the selected
 * book remains a responsibility of the
 * SelectedBookPageComponent
 */
@Component({
  standalone: true,
  selector: 'bc-view-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectedBookPageComponent],
  template: ` <bc-selected-book-page></bc-selected-book-page> `,
})
export class ViewBookPageComponent implements OnDestroy {
  private readonly store = inject(Store);

  private readonly actionsSubscription = inject(ActivatedRoute)
    .params.pipe(
      map((params) => ViewBookPageActions.selectBook({ id: params.id }))
    )
    .subscribe((action) => this.store.dispatch(action));

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
