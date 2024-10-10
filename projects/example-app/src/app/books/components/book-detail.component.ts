import {
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';

import { Book } from '@example-app/books/models';
import { MaterialModule } from '@example-app/material';
import { BookAuthorsComponent } from './book-authors.component';

@Component({
  standalone: true,
  selector: 'bc-book-detail',
  imports: [MaterialModule, BookAuthorsComponent],
  template: `
    @let value = book(); @let volumeInfo = book().volumeInfo;
    <mat-card>
      <mat-card-title-group>
        <mat-card-title>{{ volumeInfo.title }}</mat-card-title>
        @if (volumeInfo.subtitle) {
        <mat-card-subtitle>{{ volumeInfo.subtitle }}</mat-card-subtitle>
        } @if (thumbnail()) {
        <img mat-card-sm-image [src]="thumbnail()" />
        }
      </mat-card-title-group>
      <mat-card-content>
        <p [innerHtml]="volumeInfo.description"></p>
      </mat-card-content>
      <mat-card-footer class="footer">
        <bc-book-authors [book]="value"></bc-book-authors>
      </mat-card-footer>
      <mat-card-actions align="start">
        @if (inCollection()) {
        <button mat-raised-button color="warn" (click)="remove.emit(value)">
          Remove Book from Collection
        </button>
        } @else {
        <button mat-raised-button color="primary" (click)="add.emit(value)">
          Add Book to Collection
        </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin: 4.5rem 0;
      }

      mat-card {
        padding: 1rem;
        max-width: 600px;
      }

      img {
        width: 60px;
        min-width: 60px;
        margin-left: 5px;
      }

      mat-card-content {
        padding: 0;
        margin: 1rem 0;
      }

      mat-card-actions {
        justify-content: center;
      }
    `,
  ],
})
export class BookDetailComponent {
  /**
   * Presentational components receive data through input and communicate events
   * through output but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  readonly book = input.required<Book>();
  readonly inCollection = input(false);

  readonly add = output<Book>();
  readonly remove = output<Book>();

  protected readonly thumbnail = computed(() =>
    this.book().volumeInfo.imageLinks.smallThumbnail.replace('http:', '')
  );
}
