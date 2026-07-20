import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export const TOP_BANNER_DISMISSED_STORAGE_KEY = 'ngrx-top-banner-dismissed';

@Component({
  selector: 'ngrx-top-banner',
  imports: [RouterLink],
  template: `
    <div class="banner">
      <div class="banner-content">
        <span class="banner-label">Upcoming Workshops</span>
        <span class="banner-text">
          New NgRx workshops are coming up!
          <span class="banner-text-extended">
            Join us online for 3 days of in-depth Angular and NgRx training.
          </span>
        </span>
        <a routerLink="/workshops" class="banner-link"> Learn more &rarr; </a>
      </div>
      <button
        class="banner-dismiss"
        aria-label="Dismiss banner"
        (click)="dismiss.emit()"
      >
        &#x2715;
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-left: 270px;

        @media only screen and (max-width: 1280px) {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          margin-left: 0;
          z-index: 3;
        }
      }

      .banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 20px;
        height: 44px;
        box-sizing: border-box;
        background-color: rgba(170, 27, 182, 0.12);
        border-bottom: 1px solid rgba(170, 27, 182, 0.25);
        backdrop-filter: blur(4px);

        @media only screen and (max-width: 1280px) {
          height: auto;
          padding: 10px 20px;
          align-items: flex-start;
        }
      }

      .banner-content {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 0;
        overflow: hidden;

        @media only screen and (max-width: 1280px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
      }

      .banner-label {
        flex-shrink: 0;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        padding: 2px 10px;
        border-radius: 20px;
        background-color: rgba(170, 27, 182, 0.18);
        border: 1px solid rgba(170, 27, 182, 0.3);
        color: var(--ngrx-link);

        @media only screen and (max-width: 1280px) {
          display: none;
        }
      }

      .banner-text {
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        @media only screen and (max-width: 1280px) {
          white-space: normal;
          overflow: visible;
          text-overflow: unset;
        }
      }

      .banner-text-extended {
        @media only screen and (max-width: 1280px) {
          display: none;
        }
        min-width: 0;
      }

      .banner-link {
        flex-shrink: 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--ngrx-link);
        text-decoration: none;
        white-space: nowrap;
      }

      .banner-link:hover {
        text-decoration: underline;
      }

      .banner-dismiss {
        flex-shrink: 0;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        color: inherit;
        opacity: 0.5;
        padding: 4px 8px;
        line-height: 1;
        border-radius: 4px;
      }

      .banner-dismiss:hover {
        opacity: 1;
        background-color: rgba(170, 27, 182, 0.1);
      }
    `,
  ],
})
export class TopBannerComponent {
  readonly dismiss = output<void>();
}
