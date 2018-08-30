import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BookAuthorsComponent } from '@example-app/books/components/book-authors.component';
import { BookDetailComponent } from '@example-app/books/components/book-detail.component';
import { BookPreviewComponent } from '@example-app/books/components/book-preview.component';
import { BookPreviewListComponent } from '@example-app/books/components/book-preview-list.component';
import { BookSearchComponent } from '@example-app/books/components/book-search.component';

import { PipesModule } from '@example-app/shared/pipes';
import { MaterialModule } from '@example-app/material';

export const COMPONENTS = [
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    PipesModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ComponentsModule {}
