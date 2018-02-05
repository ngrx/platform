import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Book } from '../models/book';

@Component({
  selector: 'bc-book-detail',
  template: `
    <mat-card *ngIf="book">
      <mat-card-title-group>
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
        <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
      </mat-card-title-group>
      <mat-card-content>
        <p [innerHtml]="description"></p>
      </mat-card-content>
      <mat-card-footer class="footer">
        <bc-book-authors [book]="book"></bc-book-authors>
      </mat-card-footer>
      <mat-card-actions align="start">
        <button mat-raised-button color="warn" *ngIf="inCollection" (click)="remove.emit(book)">
        Remove Book from Collection
        </button>

        <button mat-raised-button color="primary" *ngIf="!inCollection" (click)="add.emit(book)">
        Add Book to Collection
        </button>
      </mat-card-actions>
    </mat-card>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    mat-card {
      max-width: 600px;
    }
    mat-card-title-group {
      margin-left: 0;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    mat-card-content {
      margin: 15px 0 50px;
    }
    mat-card-actions {
      margin: 25px 0 0 !important;
    }
    mat-card-footer {
      padding: 0 25px 25px;
      position: relative;
    }
  `,
  ],
})
export class BookDetailComponent {
  /**
   * Presentational components receive data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() book: Book;
  @Input() inCollection: boolean;
  @Output() add = new EventEmitter<Book>();
  @Output() remove = new EventEmitter<Book>();

  /**
   * Tip: Utilize getters to keep templates clean
   */
  get id() {
    return this.book.id;
  }

  get title() {
    return this.book.volumeInfo.title;
  }

  get subtitle() {
    return this.book.volumeInfo.subtitle;
  }

  get description() {
    return this.book.volumeInfo.description;
  }

  get thumbnail() {
    return (
      this.book.volumeInfo.imageLinks &&
      this.book.volumeInfo.imageLinks.smallThumbnail
    );
  }
}
