import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithCustomElementComponent } from '../element-registry';
import { EventListComponent } from './event-list.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ EventListComponent ],
  entryComponents: [ EventListComponent ]
})
export class EventListModule implements WithCustomElementComponent {
  customElementComponent: Type<any> = EventListComponent;
}
