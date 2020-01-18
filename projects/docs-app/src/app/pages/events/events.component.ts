import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'docs-events',
  template: `
    <header class="marketing-banner">
      <h1 class="banner-headline no-toc no-anchor">Events</h1>
    </header>
    <article>
        <aio-event-list></aio-event-list>
    </article>
  `,
  styles: [],
})
export class EventsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
