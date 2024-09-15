import { Component, Input } from '@angular/core';

import { Book } from '@example-app/books/models';
import { BookPreviewComponent } from './book-preview.component';

@Component({
  standalone: true,
  selector: 'bc-book-preview-list',
  imports: [BookPreviewComponent],
  template: `
    @for (book of books; track book) {
    <bc-book-preview [book]="book"></bc-book-preview>
    }
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
})
export class BookPreviewListComponent {
  @Input() books = new Array<Book>();
}
