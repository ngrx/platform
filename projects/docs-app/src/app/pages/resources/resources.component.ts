import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'docs-resources',
  template: `
    <header class="marketing-banner">
      <h1 class="banner-headline no-toc no-anchor">Explore NgRx Resources</h1>
    </header>

    <article>
      <aio-resource-list></aio-resource-list>
    </article>
  `,
  styles: [],
})
export class ResourcesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
