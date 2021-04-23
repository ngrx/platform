import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithCustomElementComponent } from '../element-registry';
import { StoreAnimationComponent } from './store-animation.component';
import { CirclesModule } from './circles.module';

@NgModule({
    imports: [CommonModule, CirclesModule],
    declarations: [StoreAnimationComponent],
    exports: [StoreAnimationComponent],
    entryComponents: [StoreAnimationComponent],
})
export class StoreAnimationModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = StoreAnimationComponent;
}
