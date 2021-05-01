import {
    Component,
    Input,
    AfterContentInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { PrettyPrinter } from '../code/pretty-printer.service';

const EFFECTS_EXAMPLE = `
search$ = createEffect(() => 
  this.actions$.pipe(
    ofType(BookActions.search),
    exhaustMap(action =>
      this.googleBooksService.search(action.query)
    )
  )
);`;

const SCHEMATICS_EXAMPLE = `
$ ng g store State --root --module app.module.ts
 create src/app/reducers/index.ts
 update src/app/app.module.ts
`;

@Component({
    selector: 'ngrx-code-block',
    template: `
    <div class="prettyprint-scroller">
      <pre class="prettyprint" #codeContainer></pre>
    </div>
  `,
})
export class CodeBlockComponent implements AfterContentInit {
    @Input() code = '';

    @ViewChild('codeContainer', { read: ElementRef, static: true })
    codeContainer;

    formattedCode = '';

    constructor(private pretty: PrettyPrinter) {}

    ngAfterContentInit() {
        const code = this.code === 'effects' ? EFFECTS_EXAMPLE : SCHEMATICS_EXAMPLE;

        this.pretty.formatCode(code).subscribe(formattedCode => {
            this.codeContainer.nativeElement.innerHTML = formattedCode;
        });
    }
}
