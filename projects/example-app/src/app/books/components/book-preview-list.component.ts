import { Component, Input } from '@angular/core';

import { Book } from '@example-app/books/models';
import { BookPreviewComponent } from './book-preview.component';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'bc-book-preview-list',
  imports: [BookPreviewComponent, NgFor],
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
})
export class BookPreviewListComponent {
  @Input() books!: Book[];
}
