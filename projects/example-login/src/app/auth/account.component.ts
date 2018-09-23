import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  template: `
        <router-outlet></router-outlet>
    `,
})
export class AccountComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
