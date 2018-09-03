import { Component, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/compiler/src/core';

@Component({
  selector: 'ngrx-code-blocker',
  template: `
    <pre class="prettyprint">{{ code }}</pre>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CodeBlockComponent {
  @Input()
  code = `@Effect() search$ = this.actions$.pipe(
    ofType<SearchAction>(BookActions.Types.Search),
    map(action => action.query),
    switchMap(query =>
      this.googleBooksService.search(query)
    ),
  );`;
}
