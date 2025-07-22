import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { SymbolChipComponent } from '@ngrx-io/app/components/docs/symbol-chip.component';
import { ReferenceService } from '@ngrx-io/app/reference/reference.service';
import { MinimizedApiMemberSummary } from '@ngrx-io/shared';

@Component({
  selector: 'ngrx-reference-index-page',
  standalone: true,
  imports: [
    SymbolChipComponent,
    MatFormField,
    MatInput,
    MatPrefix,
    MatIcon,
    MatSlideToggle,
  ],
  template: `
    <div class="controls">
      <h2>API Reference</h2>
      <!--<div class="deprecated">
        <mat-slide-toggle>Hide Deprecated</mat-slide-toggle>
      </div>-->
      <div class="filter">
        <mat-icon matPrefix>search</mat-icon>
        <input
          matInput
          placeholder="Search"
          [value]="searchTerm()"
          (input)="onSearch($event)"
        />
      </div>
    </div>

    @for (pkg of filteredPackages(); track pkg.packageName) {
    <h3>{{ pkg.packageName }}</h3>
    <div class="packageSymbols">
      @for (symbol of pkg.symbols; track symbol.canonicalReference) {
      <ngrx-symbol-chip [symbol]="symbol" />
      }
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 0 24px 24px;
        @media only screen and (max-width: 1280px) {
          padding-top: 62px;
        }
      }

      .controls {
        display: flex;
        width: 100%;
        height: 84px;
        padding: 8px 0 24px;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: #17111a;
        @media only screen and (max-width: 1280px) {
          top: 62px;
        }
      }

      h3 {
        margin: 32px 0 24px;
      }

      .filter {
        position: relative;
      }

      .filter mat-icon {
        position: absolute;
        top: 6px;
        left: 6px;
        bottom: 0;
        display: flex;
        align-items: center;
        color: rgba(255, 255, 255, 0.54);
      }

      .filter input {
        background-color: transparent;
        border: none;
        color: white;
        font-size: 16px;
        padding: 8px 0 8px 38px;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 4px;
      }

      .packageSymbols {
        width: 100%;
        padding: 0 24px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        border-left: 1px solid rgba(255, 255, 255, 0.12);
        @media only screen and (max-width: 1280px) {
          grid-template-columns: repeat(2, 1fr);
        }
        @media only screen and (max-width: 700px) {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export default class ApiIndexPageComponent {
  referenceService = inject(ReferenceService);
  searchTerm = signal<string>('');
  filteredPackages = computed(() => {
    const packageReport = this.referenceService.getMinifiedApiReport();
    const term = this.searchTerm();

    if (!packageReport) return [];

    return packageReport.packageNames.reduce((packages, packageName) => {
      const pkg = packageReport.packages[packageName];
      const symbols = pkg.symbolNames.map(
        (symbolName) => pkg.symbols[symbolName]
      );
      const filteredSymbols = symbols.filter(
        (symbol) =>
          !symbol.isDeprecated &&
          symbol.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())
      );

      return filteredSymbols.length > 0
        ? [...packages, { packageName, symbols }]
        : packages;
    }, [] as { packageName: string; symbols: MinimizedApiMemberSummary[] }[]);
  });

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }
}
