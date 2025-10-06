import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/core';
import { CanonicalReference, ParsedCanonicalReference } from '@ngrx-io/shared';

export const CanonicalReferenceExtension = {
  name: 'canonicalReference',
  level: 'inline',
  tokenizer(src: string): any {
    const rule = /@?[\w/]+![\w]+:[\w]+/;
    const match = rule.exec(src);
    console.log({ src, match });
    if (match) {
      const parsed = new ParsedCanonicalReference(
        match[0] as CanonicalReference
      );
      const [before, after] = src.split(match[0]);
      return {
        type: 'canonicalReference',
        raw: src,
        name: parsed.name,
        canonicalReference: parsed.referenceString,
        before,
        after,
        tokens: [],
      };
    }
  },
  renderer(this: any, token: any) {
    return `${token.before}<ngrx-docs-symbol-link reference="${token.canonicalReference}" />${token.after}`;
  },
  childTokens: [],
};

@Pipe({
  name: 'ngrxMarkdown',
  standalone: true,
  pure: true,
})
export class MarkdownPipe implements PipeTransform {
  marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang, _info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );
  domSanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    this.marked.use({ extensions: [CanonicalReferenceExtension] });
    return this.domSanitizer.bypassSecurityTrustHtml(
      this.marked.parse(value) as string
    );
  }
}
