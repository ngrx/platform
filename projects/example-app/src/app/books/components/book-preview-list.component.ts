import { Component, Input } from '@angular/core';

import { Book } from '@example-app/books/models';

@Component({
  selector: 'bc-book-preview-list',
  template: `
    <bc-book-preview *ngFor="let book of books" [book]="book"></bc-book-preview>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    `,
  ],
  standalone: false,
})
export class BookPreviewListComponent {
  @Input() books!: Book[];
}
