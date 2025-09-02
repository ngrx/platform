import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { FlattenedLink } from '../services/guide-menu.service';

@Component({
  selector: 'ngrx-guide-footer',
  standalone: true,
  imports: [RouterLink, MatIcon],
  template: `
    <div class="linkWrapper previous">
      @if (previousLink(); as previousLink) {
        <a [routerLink]="previousLink.url">
          <mat-icon>chevron_left</mat-icon>
          <div class="parents">
            @for (parent of previousLink.parents; track $index) {
              <span>{{ parent }}</span>
              @if ($index < previousLink.parents.length - 1) {
                <span> > </span>
              }
            }
          </div>
          <span class="linkText">{{ previousLink.text }}</span>
        </a>
      }
    </div>
    <div class="linkWrapper next">
      @if (nextLink(); as nextLink) {
        <a [routerLink]="nextLink.url">
          <div class="parents">
            @for (parent of nextLink.parents; track $index) {
              <span>{{ parent }}</span>
              @if ($index < nextLink.parents.length - 1) {
                <span> > </span>
              }
            }
          </div>
          <span class="linkText">{{ nextLink.text }}</span>
          <mat-icon>chevron_right</mat-icon>
        </a>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        width: 960px;
        padding-top: 24px;
        margin-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        @media only screen and (max-width: 1280px) {
          width: 100%;
        }
        @media only screen and (max-width: 480px) {
          grid-template-columns: 1fr;
        }
      }

      .linkWrapper a {
        display: grid;
        column-gap: 16px;
        width: 100%;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        align-items: center;
        transition: border-color 200ms;
        height: 100%;
      }

      .linkWrapper.previous a {
        grid-template-areas:
          'icon parents'
          'icon linkText';
        grid-template-columns: 32px 1fr;
      }

      .linkWrapper.next a {
        grid-template-areas:
          'parents icon'
          'linkText icon';
        grid-template-columns: 1fr 32px;
        text-align: right;
      }

      .parents {
        grid-area: parents;
        color: rgba(255, 255, 255, 0.54);
        font-weight: 600;
        font-size: 12px;
      }

      mat-icon {
        grid-area: icon;
        font-size: 32px;
        position: relative;
        top: -2px;
        color: rgba(255, 255, 255, 0.54);
        transition: color 200ms;
      }

      .linkText {
        grid-area: linkText;
      }

      .linkWrapper a:hover {
        border-color: rgba(207, 143, 197, 1);
      }

      .linkWrapper a:hover mat-icon {
        color: rgba(207, 143, 197, 1);
      }
    `,
  ],
})
export class GuideFooterComponent {
  previousLink = input.required<FlattenedLink | null>();
  nextLink = input.required<FlattenedLink | null>();
}
