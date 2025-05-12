import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked } from 'marked';

@Pipe({
  name: 'ngrxInlineMarkdown',
  standalone: true,
  pure: true,
})
export class InlineMarkdownPipe implements PipeTransform {
  marked = new Marked();
  domSanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(
      this.marked.parseInline(value) as string
    );
  }
}
