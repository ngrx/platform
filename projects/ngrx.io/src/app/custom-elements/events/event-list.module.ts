import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithCustomElementComponent } from '../element-registry';
import { EventListComponent } from './event-list.component';
import { EventService } from './event.service';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ EventListComponent ],
  entryComponents: [ EventListComponent ],
  providers: [ EventService ]
})
export class EventListModule implements WithCustomElementComponent {
  customElementComponent: Type<any> = EventListComponent;
}
