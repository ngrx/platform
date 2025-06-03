import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ngrx-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="logo-and-copyright">
      <a routerLink="/" class="logo">
        <img src="/ngrx-logo.svg" alt="NGRX Logo" />
      </a>
      <span>&copy; {{ currentYear }} NgRx</span>
      <span>Released under the MIT License</span>
    </div>

    <nav class="learn-ngrx">
      <h4>Learn NgRx</h4>
      <a routerLink="/workshops">Workshops</a>
      <a routerLink="/api">API Reference</a>
      <a routerLink="/support">Support</a>
    </nav>

    <nav class="packages">
      <h4>Packages</h4>
      <a routerLink="/guide/store">Store</a>
      <a routerLink="/guide/effects">Effects</a>
      <a routerLink="/guide/signals">Signals</a>
      <a routerLink="/guide/operators">Operators</a>
    </nav>

    <nav class="community">
      <h4>Community</h4>
      <a href="">Blog</a>
      <a href="">GitHub</a>
      <a href="">X/Twitter</a>
      <a href="">Discord</a>
    </nav>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 280px 1fr 1fr 1fr;
        gap: 32px;
        padding: 32px;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        @media only screen and (max-width: 1280px) {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      img {
        width: 80px;
        height: auto;
      }

      span {
        opacity: 0.64;
      }

      .logo-and-copyright,
      nav {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
