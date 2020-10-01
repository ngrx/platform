@NgModule({
    imports: [
      BrowserModule,
      StoreModule.forRoot({ books: booksReducer, collection: collectionReducer }),
      HttpClientModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
  })
  export class AppModule {}