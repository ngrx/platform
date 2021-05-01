import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithCustomElementComponent } from '../element-registry';
import { EventListComponent } from './event-list.component';
import { EventService } from './event.service';
import { EventDateRangePipe } from './event-date-range.pipe';
import { EventOrderByPipe } from './event-order-by.pipe';

@NgModule({
    imports: [ CommonModule ],
    declarations: [ EventListComponent, EventDateRangePipe, EventOrderByPipe ],
    entryComponents: [ EventListComponent ],
    providers: [ EventService ]
})
export class EventListModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = EventListComponent;
}
