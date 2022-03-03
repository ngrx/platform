import { Component } from '@angular/core';

@Component({
    selector: 'ngrx-mff',
    template: `
    <p>
      The NgRx Team asks our community to support the people of Ukraine
      who are being invaded by Russia.
    </p>

    <a href="https://supportukrainenow.org/" target="_blank">
      Donate Now
    </a>
  `,
    styles: [`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 0 auto;
      padding: 60px;
      background-color: #211424;
      position: relative;
      top: -60px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.12);
    }

    p {
      font-size: 18px;
      margin-bottom: 32px;
      text-align: center;
    }

    a {
      display: block;
      font-size: 18px;
      padding: 12px 28px;
      background-color: #a829c3;
      color: white;
      text-transform: uppercase;
      border-radius: 2px;
    }

    @media screen and (max-width: 760px) {
      :host {
        margin-bottom: -74px;
      }
    }
  `]
})
export class MffComponent {}
