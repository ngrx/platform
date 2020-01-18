import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventsComponent } from './events.component';
import { EventListModule } from '../../custom-elements/events/event-list.module';

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    EventListModule,
    RouterModule.forChild([{ path: '', component: EventsComponent }]),
  ],
})
export class EventsModule {}
