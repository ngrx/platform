import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../book-list/books.model';

@Component({
  selector: 'app-book-collection',
  template: `
    @for(book of books; track book) {
    <div class="book-item">
      <p>{{ book.volumeInfo.title }}</p>
      <span> by {{ book.volumeInfo.authors }}</span>
      <button (click)="remove.emit(book.id)">Remove from Collection</button>
    </div>
    }
  `,
})
export class BookCollection {
  @Input()
  books: ReadonlyArray<Book> = [];
  @Output()
  remove = new EventEmitter<string>();
}
