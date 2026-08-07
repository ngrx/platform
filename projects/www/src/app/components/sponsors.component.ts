import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngrx-sponsors',
  template: `
    <h2>Gold Sponsors</h2>
    <p>
      Sponsorships aid in the continued development and maintenance of NgRx.
    </p>
    <div class="logos">
      <a href="https://nx.dev" target="_blank" title="Nx">
        <img
          class="nx"
          src="/images/sponsors/nx.png"
          alt="Nx logo"
          width="175"
          height="109"
        />
      </a>
      <a href="https://coderabbit.link/ngrx" target="_blank" title="CodeRabbit">
        <img
          class="coderabbit"
          src="/images/sponsors/coderabbit-light-bg.png"
          alt="CodeRabbit logo"
          width="320"
          height="47"
        />
      </a>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 32px;
      border-top: 1px solid var(--ngrx-border-color);
    }

    h2 {
      font-weight: 500;
      font-family: 'Oxanium', sans-serif;
    }

    p {
      color: var(--ngrx-text-secondary);
      text-align: center;
    }

    .logos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 24px;
      margin-top: 16px;
    }

    a {
      display: grid;
      place-items: center;
      height: 200px;
      padding: 24px 32px;
      border-radius: 16px;
      background: #fff;
      border: 1px solid var(--ngrx-border-color);
      transition: transform 0.2s ease;
    }

    a:hover {
      transform: translateY(-2px);
    }

    /* Sized so all logos take up a similar amount of space despite their very
       different aspect ratios. */
    img {
      display: block;
      height: auto;
    }

    .nx {
      width: 175px;
    }

    .coderabbit {
      width: 310px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorsComponent {}
