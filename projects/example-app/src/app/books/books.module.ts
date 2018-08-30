import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@example-app/books/components';
import { BookEffects } from '@example-app/books/effects/book.effects';
import { CollectionEffects } from '@example-app/books/effects/collection.effects';

import { FindBookPageComponent } from '@example-app/books/containers/find-book-page.component';
import { ViewBookPageComponent } from '@example-app/books/containers/view-book-page.component';
import { SelectedBookPageComponent } from '@example-app/books/containers/selected-book-page.component';
import { CollectionPageComponent } from '@example-app/books/containers/collection-page.component';
import { MaterialModule } from '@example-app/material';

import { reducers } from '@example-app/books/reducers';
import { BooksRoutingModule } from '@example-app/books/books-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ComponentsModule,
    BooksRoutingModule,

    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature('books', reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([BookEffects, CollectionEffects]),
  ],
  declarations: [
    FindBookPageComponent,
    ViewBookPageComponent,
    SelectedBookPageComponent,
    CollectionPageComponent,
  ],
})
export class BooksModule {}
