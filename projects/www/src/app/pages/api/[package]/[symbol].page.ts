import {
  Component,
  computed,
  input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SymbolComponent } from '@ngrx-io/app/components/docs/symbol.component';
import { ReferenceService } from '@ngrx-io/app/reference/reference.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'ngrx-reference-symbol-page',
  standalone: true,
  template: `
    @if (resolvedSymbol(); as summary) {
    <ngrx-symbol [summary]="summary" />
    }
  `,
  imports: [SymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PackageSymbolPageComponent {
  referenceService = inject(ReferenceService);
  package = input.required<string>();
  symbol = input.required<string>();
  inputs = computed(() => ({
    package: this.package(),
    symbol: this.symbol(),
  }));
  resolvedSymbol = toSignal(
    toObservable(this.inputs).pipe(
      switchMap((inputs) => {
        return this.referenceService.loadReferenceData(
          inputs.package,
          inputs.symbol
        );
      })
    )
  );
}
