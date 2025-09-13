import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from './books.model';

@Component({
  selector: 'app-book-list',
  template: `
    @for(book of books; track book) {
    <div class="book-item">
      <p>{{ book.volumeInfo.title }}</p>
      <span> by {{ book.volumeInfo.authors }}</span>
      <button (click)="add.emit(book.id)">Add to Collection</button>
    </div>
    }
  `,
})
export class BookList {
  @Input()
  books: ReadonlyArray<Book> = [];
  @Output()
  add = new EventEmitter<string>();
}
