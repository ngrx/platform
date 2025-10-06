import { Component, computed, input } from '@angular/core';
import {
  ApiExcerptToken,
  ApiExcerptTokenKind,
  ApiMember,
  ApiMemberKind,
} from '@ngrx-io/shared';
import { SymbolExcerptComponent } from './symbol-excerpt.component';
import { SymbolExcerptGroupComponent } from './symbol-excerpt-group.component';

@Component({
  selector: 'ngrx-symbol-api',
  standalone: true,
  imports: [SymbolExcerptComponent, SymbolExcerptGroupComponent],
  template: `
    <h4>{{ '@api' }}</h4>
    <ngrx-symbol-excerpt-group>
      <ngrx-symbol-excerpt [excerptTokens]="headerExcerptTokens()" />
      @for (member of bodyMembers(); track $index) {
        <ngrx-symbol-excerpt
          [excerptTokens]="member.excerptTokens"
          [deprecated]="!!member.docs.deprecated"
          class="memberExcerpt"
        />
      }
      @if (footerExcerptTokens().length) {
        <ngrx-symbol-excerpt [excerptTokens]="footerExcerptTokens()" />
      }
    </ngrx-symbol-excerpt-group>
  `,
  styles: [
    `
      :host {
        display: flex;
        padding: 8px;
        flex-direction: column;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
      }

      h4 {
        font-family: 'Oxanium', monospace;
        font-size: 15px;
        font-weight: 700;
        margin: 0;
        padding: 8px;
        color: #fface6;
      }

      .memberExcerpt {
        margin-left: 16px;
      }
    `,
  ],
})
export class SymbolApiComponent {
  symbol = input.required<ApiMember>();
  headerExcerptTokens = computed((): ApiExcerptToken[] => {
    const symbol = this.symbol();

    if (
      symbol.kind === ApiMemberKind.Class ||
      symbol.kind === ApiMemberKind.Interface ||
      symbol.kind === ApiMemberKind.Enum
    ) {
      return [
        ...symbol.excerptTokens,
        {
          kind: ApiExcerptTokenKind.Content,
          text: ' {',
        },
      ];
    }

    return symbol.excerptTokens;
  });
  bodyMembers = computed((): ApiMember[] => {
    const symbol = this.symbol();

    if (
      symbol.kind === ApiMemberKind.Class ||
      symbol.kind === ApiMemberKind.Interface ||
      symbol.kind === ApiMemberKind.Enum
    ) {
      const members = symbol.members ?? [];
      const [nonDeprecatedMembers, deprecatedMembers] = members.reduce(
        (acc, member) => {
          if (member.docs.deprecated) {
            acc[1].push(member);
          } else {
            acc[0].push(member);
          }

          return acc;
        },
        [[], []] as [ApiMember[], ApiMember[]]
      );

      return [...nonDeprecatedMembers, ...deprecatedMembers];
    }

    return [];
  });
  footerExcerptTokens = computed((): ApiExcerptToken[] => {
    const symbol = this.symbol();

    if (
      symbol.kind === ApiMemberKind.Class ||
      symbol.kind === ApiMemberKind.Interface ||
      symbol.kind === ApiMemberKind.Enum
    ) {
      return [
        {
          kind: ApiExcerptTokenKind.Content,
          text: '}',
        },
      ];
    }

    return [];
  });
}
