import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ApiMember, ApiMemberKind } from '@ngrx-io/shared';
import { SymbolExcerptComponent } from './symbol-excerpt.component';
import { InlineMarkdownPipe } from './inline-markdown.pipe';
import { SymbolTypeParamsComponent } from './symbol-type-params.component';
import { SymbolParamsComponent } from './symbol-params.component';
import { SymbolReturnsComponent } from './symbol-returns.component';
import { SymbolApiComponent } from './symbol-api.component';
import { DeprecatedChipComponent } from './deprecated-chip.component';
import { CodeHighlightPipe } from './code-highlight.pipe';
import { SymbolUsageNotesComponent } from './symbol-usage-notes.component';

@Component({
  selector: 'ngrx-symbol-methods',
  standalone: true,
  imports: [
    NgClass,
    SymbolApiComponent,
    SymbolExcerptComponent,
    SymbolParamsComponent,
    SymbolTypeParamsComponent,
    SymbolReturnsComponent,
    SymbolUsageNotesComponent,
    InlineMarkdownPipe,
    DeprecatedChipComponent,
    CodeHighlightPipe,
  ],
  template: `
    @if (methods().length) {
    <div class="methods">
      <h3>{{ '@methods' }}</h3>

      @for (method of methods(); track $index) {
      <div class="method">
        <div class="header">
          <div
            class="methodName"
            [ngClass]="{ deprecated: method.docs.deprecated }"
          >
            <code
              [innerHTML]="getMethodSignature(method) | ngrxCodeHighlight"
            ></code>
          </div>
          @if (method.docs.deprecated) {
          <ngrx-deprecated-chip [reason]="method.docs.deprecated" />
          } @if (method.docs.summary; as summary) {
          <p class="summary" [innerHtml]="summary | ngrxInlineMarkdown"></p>
          }
        </div>

        <ngrx-symbol-api [symbol]="method" />
        <ngrx-symbol-returns [symbol]="method" />
        <ngrx-symbol-params [symbol]="method" />
        <ngrx-symbol-type-params [symbol]="method" />
        <ngrx-symbol-usage-notes [symbol]="method" />
      </div>
      }
    </div>
    }
  `,
  styles: [
    `
      .methods {
        display: block;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      h3 {
        font-family: 'Oxanium', monospace;
        font-size: 15px;
        font-weight: 700;
        padding: 8px 16px;
        color: #fface6;
      }

      .method {
        display: flex;
        flex-direction: column;
        padding: 8px;
      }

      .header {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr max-content;
        grid-template-areas:
          'name deprecated'
          'summary summary';
      }

      .summary {
        font-size: 16px;
        margin: 0;
        padding: 8px;
        grid-area: summary;
      }

      .methodSymbol {
        font-weight: 700;
      }

      .methodName {
        padding: 8px;
        display: flex;
        flex-direction: row;
        grid-area: name;
      }

      .methodName.deprecated {
        text-decoration: line-through;
        font-style: italic;
      }

      code {
        font-family: 'Oxanium', sans-serif;
        font-size: 18px;
      }

      ngrx-deprecated-chip {
        grid-area: deprecated;
      }

      .returns {
        grid-area: returns;
      }

      .summary {
        grid-area: summary;
      }

      p {
        font-size: 13px;
        padding: 0;
        margin: 0;
      }

      ngrx-symbol-api,
      ngrx-symbol-returns,
      ngrx-symbol-params,
      ngrx-symbol-type-params,
      ngrx-symbol-usage-notes {
        /* border-top: none; */
        margin-left: 8px;
        border-left: 16px solid rgba(255, 255, 255, 0.12);
        border-right: 1px solid rgba(255, 255, 255, 0.12);
      }
    `,
  ],
})
export class SymbolMethodsComponent {
  symbol = input.required<ApiMember>();
  methods = computed(() => {
    const members = this.symbol().members ?? [];
    const methods = members.filter(
      (member) => member.kind === ApiMemberKind.Method
    );
    const [nonDeprecatedMethods, deprecatedMethods] = methods.reduce(
      (acc, method) => {
        if (method.docs.deprecated) {
          acc[1].push(method);
        } else {
          acc[0].push(method);
        }

        return acc;
      },
      [[], []] as [ApiMember[], ApiMember[]]
    );

    return [...nonDeprecatedMethods, ...deprecatedMethods].map((member) => {
      const parameters = member.parameters ?? [];

      return {
        ...member,
        simpleParameters: parameters.map((param, index) => {
          return {
            name: param.parameterName,
            isLast: index === parameters.length - 1,
          };
        }),
      };
    });
  });

  getMethodSeparater(method: ApiMember) {
    return method.isStatic ? '.' : '#';
  }

  getMethodSignature(method: ApiMember) {
    const symbolName = this.symbol().name;
    const instanceName = method.isStatic
      ? symbolName
      : `${symbolName[0].toLowerCase()}${symbolName.slice(1)}`;
    const parameters = method.parameters ?? [];
    const simpleParameters = parameters.map((param) => param.parameterName);

    return `${instanceName}.${method.name}(${simpleParameters.join(', ')})`;
  }
}
