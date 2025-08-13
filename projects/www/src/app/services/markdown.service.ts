import { MarkedSetupService } from '@analogjs/content';
import { Injectable } from '@angular/core';
import { CanonicalReference, ParsedCanonicalReference } from '@ngrx-io/shared';
import hljs from 'highlight.js';
import { Marked, marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

export const CanonicalReferenceExtension = {
  name: 'canonicalReference',
  level: 'inline',
  tokenizer(this: any, src: string): any {
    const rule = /@?[\w/-]+![\w]+:[\w]+/;
    const match = rule.exec(src);
    if (match) {
      const parsed = new ParsedCanonicalReference(
        match[0] as CanonicalReference
      );

      const index = src.indexOf(match[0]);
      const before = src.slice(0, index);
      const after = src.slice(index + match[0].length);

      const token = {
        type: 'canonicalReference',
        raw: src,
        text: match[0],
        name: parsed.name,
        canonicalReference: parsed.referenceString,
        before,
        after,
        beforeTokens: [],
        afterTokens: [],
      };

      this.lexer.inline(token.before, token.beforeTokens);
      this.lexer.inline(token.after, token.afterTokens);

      return token;
    }
  },
  renderer(this: any, token: any) {
    return `${this.parser.parseInline(
      token.beforeTokens
    )}<ngrx-docs-symbol-link reference="${
      token.canonicalReference
    }"></ngrx-docs-symbol-link>${this.parser.parseInline(token.afterTokens)}`;
  },
  childTokens: [],
};

@Injectable()
export class NgRxMarkedSetupService extends MarkedSetupService {
  private _marked = new Marked(
    markedHighlight({
      highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    }),
    {
      extensions: [CanonicalReferenceExtension],
    }
  );

  constructor() {
    super();

    this.getMarkedInstance().use();
  }

  override getMarkedInstance(): typeof marked {
    // eslint-disable-next-line no-underscore-dangle
    return this._marked as unknown as typeof marked;
  }
}
