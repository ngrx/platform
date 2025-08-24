import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ngrxTheme } from '@ngrx-io/shared/ngrx-shiki-theme';
import {
  BundledLanguage,
  BundledTheme,
  getHighlighter,
  HighlighterGeneric,
} from 'shiki';

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>;
getHighlighter({
  langs: ['typescript'],
  themes: [ngrxTheme],
}).then((h) => (highlighter = h));

@Pipe({
  name: 'ngrxCodeHighlight',
  standalone: true,
  pure: true,
})
export class CodeHighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(code: string): SafeHtml {
    const html = highlighter?.codeToHtml(code, {
      lang: 'typescript',
      theme: 'ngrx-theme',
    });

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
