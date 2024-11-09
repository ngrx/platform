import { Component, computed, input, Input } from '@angular/core';

import { Book } from '@example-app/books/models';
import { MaterialModule } from '@example-app/material';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';

@Component({
  standalone: true,
  selector: 'bc-book-authors',
  imports: [MaterialModule, AddCommasPipe],
  template: `
    <h5 mat-subheader>Written By:</h5>
    <span>
      {{ authors() | bcAddCommas }}
    </span>
  `,
  styles: [
    `
      h5 {
        margin-bottom: 5px;
      }
    `,
  ],
})
export class BookAuthorsComponent {
  book = input<Book>();

  protected readonly authors = computed(
    () => this.book()?.volumeInfo.authors || []
  );
}
