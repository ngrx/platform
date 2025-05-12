import { Pipe, PipeTransform } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('typescript', typescript);

@Pipe({
  name: 'ngrxCodeHighlight',
  pure: true,
  standalone: true,
})
export class CodeHighlightPipe implements PipeTransform {
  transform(code: string): string {
    return hljs.highlight(code, { language: 'typescript' }).value;
  }
}
