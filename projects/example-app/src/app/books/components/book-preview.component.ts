import { Component, Input } from '@angular/core';

import { Book } from '@example-app/books/models';

@Component({
  selector: 'bc-book-preview',
  template: `
    <a [routerLink]="['/books', id]">
      <mat-card>
        <mat-card-title-group>
          <img
            mat-card-sm-image
            *ngIf="thumbnail"
            [src]="thumbnail"
            [alt]="title"
          />
          <mat-card-title>{{ title | bcEllipsis : 35 }}</mat-card-title>
          <mat-card-subtitle *ngIf="subtitle">{{
            subtitle | bcEllipsis : 40
          }}</mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          <p *ngIf="description">{{ description | bcEllipsis }}</p>
        </mat-card-content>
        <mat-card-footer>
          <bc-book-authors [book]="book"></bc-book-authors>
        </mat-card-footer>
      </mat-card>
    </a>
  `,
  styles: [
    `
      :host,
      a {
        display: flex;
      }

      mat-card {
        width: 400px;
        margin: 1rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      @media only screen and (max-width: 768px) {
        mat-card {
          margin: 1rem 0 !important;
        }
      }

      mat-card:hover {
        box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, 0.5);
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      img {
        width: 60px;
        min-width: 60px;
        margin-left: 5px;
      }

      span {
        display: inline-block;
        font-size: 13px;
      }

      mat-card-content {
        padding: 0;
        margin: 1rem 0;
      }
    `,
  ],
})
export class BookPreviewComponent {
  @Input() book!: Book;

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

  get thumbnail(): string | boolean {
    if (this.book.volumeInfo.imageLinks) {
      return this.book.volumeInfo.imageLinks.smallThumbnail.replace(
        'http:',
        ''
      );
    }

    return false;
  }
}
