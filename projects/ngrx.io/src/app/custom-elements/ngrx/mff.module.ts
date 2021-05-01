import { NgModule, Type } from '@angular/core';
import { WithCustomElementComponent } from '../element-registry';
import { MffComponent } from './mff.component';

@NgModule({
    declarations: [MffComponent],
    exports: [MffComponent],
    entryComponents: [MffComponent],
})
export class MffModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = MffComponent;
}
