import { Component, computed, inject, input } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { SymbolComponent } from '@ngrx-io/app/components/docs/symbol.component';
import { ReferenceService } from '@ngrx-io/app/reference/reference.service';

@Component({
  selector: 'ngrx-reference-symbol-page',
  standalone: true,
  template: `
    @if (resolvedSymbol(); as summary) {
    <ngrx-symbol [summary]="summary" />
    }
  `,
  imports: [SymbolComponent],
})
export default class SubpackageSymbolPageComponent {
  referenceService = inject(ReferenceService);
  package = input.required<string>();
  subpackage = input.required<string>();
  symbol = input.required<string>();
  inputs = computed(() => ({
    package: this.package(),
    subpackage: this.subpackage(),
    symbol: this.symbol(),
  }));
  resolvedSymbol = toSignal(
    toObservable(this.inputs).pipe(
      switchMap((inputs) =>
        this.referenceService.loadReferenceData(
          `${inputs.package}/${inputs.subpackage}`,
          inputs.symbol
        )
      ),
      takeUntilDestroyed()
    )
  );
}
