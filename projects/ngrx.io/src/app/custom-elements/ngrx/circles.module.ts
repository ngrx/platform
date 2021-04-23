import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithCustomElementComponent } from '../element-registry';
import { CirclesComponent } from './circles.component';

@NgModule({
    imports: [CommonModule],
    declarations: [CirclesComponent],
    exports: [CirclesComponent],
    entryComponents: [CirclesComponent],
})
export class CirclesModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = CirclesComponent;
}
