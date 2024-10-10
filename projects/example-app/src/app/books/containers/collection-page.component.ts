import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { Store } from '@ngrx/store';

import { CollectionPageActions } from '@example-app/books/actions/collection-page.actions';
import * as fromBooks from '@example-app/books/reducers';
import { MaterialModule } from '@example-app/material';
import { BookPreviewListComponent } from '../components';

@Component({
  standalone: true,
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookPreviewListComponent],
  template: `
    <mat-card>
      <mat-card-title>My Collection</mat-card-title>
    </mat-card>

    <bc-book-preview-list [books]="books()"></bc-book-preview-list>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [
    `
      mat-card-title {
        display: flex;
        justify-content: center;
        padding: 1rem;
      }
    `,
  ],
})
export class CollectionPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly books = this.store.selectSignal(
    fromBooks.selectBookCollection
  );

  ngOnInit() {
    this.store.dispatch(CollectionPageActions.enter());
  }
}
