import { Component, input, signal } from '@angular/core';
import { Contributor } from '../services/contributors.service';

@Component({
  selector: 'ngrx-contributor-card',
  template: `
    <div class="contributor">
      <div class="contributor-photo">
        <img
          [src]="'/images/bios/' + contributor().picture"
          alt="{{ contributor().name }}"
        />
      </div>

      <div class="contributor-info">
        <h3>{{ contributor().name }}</h3>

        <div class="contributor-links">
          @if (contributor().twitter) {
          <a
            [href]="'https://twitter.com/' + contributor().twitter"
            target="_blank"
          >
            <img src="/images/bios/card-icons/twitter.svg" alt="Twitter" />
          </a>
          } @if (contributor().website) {
          <a [href]="contributor().website" target="_blank">
            <img src="/images/bios/card-icons/link.svg" alt="Website" />
          </a>
          }
        </div>

        <p (click)="toggleBio()" class="view-bio">View Bio</p>
      </div>

      <div
        class="contributor-bio-preview"
        [class.show]="bioVisible()"
        (click)="toggleBio()"
      >
        <p>{{ contributor().bio }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .contributor {
        overflow: hidden;
        position: relative;
        width: fit-content;
        align-items: center;
        min-height: 240px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      }
      .contributor-photo {
        width: 200px;
        height: 210px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #fff;
        border-bottom: solid 4px #cf8fc5;
      }
      .contributor-photo img {
        height: 100%;
        width: auto;
        object-fit: cover;
        display: block;
      }
      .contributor-info {
        width: 200px;
        padding: 15px 0 0;
        text-align: center;
        background: #120c14;
      }
      .contributor-info h3 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 500;
      }
      .view-bio {
        margin: 10px 0 0;
        color: #cf8fc5;
        font-size: 14px;
        cursor: pointer;
        background: #221925;
        padding: 6px 0;
      }
      .view-bio:hover {
        color: #ececec;
      }
      .contributor-links {
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      .contributor-links img {
        opacity: 0.8;
      }
      .contributor-links a:hover img {
        opacity: 1;
      }
      .contributor-bio-preview {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: #120c14;
        color: #fff;
        padding: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        pointer-events: none;
        z-index: 2;
        cursor: pointer;
        background-image: url('/images/bios/card-icons/back.svg');
        background-repeat: no-repeat;
        background-position: right 12px bottom 12px;
      }
      .contributor-bio-preview.show {
        transform: translateX(0);
        pointer-events: auto;
      }
      .contributor-bio-preview p {
        margin: 0;
        color: #fff;
        font-size: 12px;
        line-height: 16px;
      }
    `,
  ],
})
export class ContributorCardComponent {
  contributor = input.required<Contributor>();
  bioVisible = signal(false);

  toggleBio() {
    this.bioVisible.set(!this.bioVisible());
  }
}
