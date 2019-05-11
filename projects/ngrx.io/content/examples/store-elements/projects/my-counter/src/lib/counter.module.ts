import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CounterComponent } from './counter.component';
import { CounterIncrementComponent } from './counter-increment/counter-increment.component';
import { CounterDecrementComponent } from './counter-decrement/counter-decrement.component';
import { CounterResetComponent } from './counter-reset/counter-reset.component';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './counter.reducer';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [CounterComponent, CounterIncrementComponent,
    CounterDecrementComponent, CounterResetComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    StoreModule.forRoot({ count: counterReducer })
  ],
  entryComponents: [CounterComponent,
    CounterIncrementComponent,
    CounterDecrementComponent,
    CounterResetComponent]
})
export class CounterModule {
    constructor(private injector: Injector ) {
      const CounterElement = createCustomElement(CounterComponent, { injector });
      // Register the custom element with the browser.
      customElements.define('counter-element', CounterElement);

      const CounterIncrementElement = createCustomElement(CounterIncrementComponent, { injector });
      customElements.define('counter-increment', CounterIncrementElement);
      const CounterDecrementElement = createCustomElement(CounterDecrementComponent, { injector });
      customElements.define('counter-decrement', CounterDecrementElement);
      const CounterResetElement = createCustomElement(CounterResetComponent, { injector });
      customElements.define('counter-reset', CounterResetElement);
    }

}
