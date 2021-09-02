import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  @Input() books: Array<Book>;
  @Output() add = new EventEmitter();
}
