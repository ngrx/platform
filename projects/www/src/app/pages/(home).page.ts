import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BannerAnimationComponent } from '../components/banner-animation.component';
import { StyledBoxComponent } from '../components/styled-box.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngrx-home-page',
  standalone: true,
  imports: [
    BannerAnimationComponent,
    MatButtonModule,
    StyledBoxComponent,
    MatIconModule,
    RouterLink,
  ],
  template: `
    <div class="banner">
      <ngrx-banner-animation></ngrx-banner-animation>
      <img src="/ngrx-logo.svg" alt="ngrx logo" width="260" />
      <h1 class="mat-display-large">Reactive State for Angular</h1>
      <a routerLink="/guide/store/walkthrough"
        ><button mat-flat-button class="cta">Learn NgRx</button></a
      >
    </div>
    <div class="content">
      <ngrx-styled-box>
        <mat-icon inline>school</mat-icon>
        <h3>Learn</h3>
        <p>
          Dive into NgRx with our getting started guide. You will learn how to
          think reactively and architect your Angular apps for success.
        </p>
        <a routerLink="/guide/store/walkthrough" mat-flat-button>Learn NgRx</a>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <mat-icon inline>co_present</mat-icon>
        <h3>Workshops</h3>
        <p>
          Attend an NgRx workshop from the creators of NgRx. Our three day
          workshops cover the entire NgRx reactive state framework, from Store
          to Effects to SignalStore.
        </p>
        <a routerLink="/workshops" mat-flat-button>Attend a Workshop</a>
      </ngrx-styled-box>
      <ngrx-styled-box>
        <mat-icon inline>help</mat-icon>
        <h3>Support</h3>
        <p>
          Join our free community Discord server to get help with NgRx, or
          schedule a 1:1 session with an NgRx expert.
        </p>
        <a routerLink="/support" mat-flat-button>Get Support</a>
      </ngrx-styled-box>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        @media only screen and (max-width: 1280px) {
          z-index: 1;
        }
      }

      .banner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100lvh;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        position: relative;
      }

      img {
        margin-bottom: 16px;
      }

      h1 {
        font-weight: 200;
        font-size: 32px;
        font-family: 'Oxanium', sans-serif;
        margin-bottom: 24px;
        text-align: center;
      }

      .cta {
        transform: scale(1.2);
      }

      ngrx-banner-animation {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
      }

      img,
      h1,
      button {
        z-index: 1;
      }

      .content {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(3, minmax(300px, 1fr));
        gap: 24px;
        padding: 32px 32px;
        @media only screen and (max-width: 1280px) {
          grid-template-columns: 1fr;
        }
      }

      ngrx-styled-box {
        display: grid;
        grid-template-rows: 40px 24px 1fr 40px;
        gap: 8px;
        padding: 24px;
      }

      ngrx-styled-box mat-icon {
        color: #cf8fc5;
        font-size: 32px;
      }

      ngrx-styled-box h3 {
        font-weight: 500;
        font-family: 'Oxanium', sans-serif;
      }

      ngrx-styled-box p {
        padding-bottom: 16px;
        color: rgba(255, 255, 255, 0.72);
      }

      ngrx-styled-box button {
        width: max-content;
      }
    `,
  ],
})
export default class HomeComponent {}
