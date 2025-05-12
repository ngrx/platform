import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GuideSectionComponent } from './guide-section.component';
import { GuideMenuService } from '../services/guide-menu.service';

@Component({
  selector: 'ngrx-menu',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, GuideSectionComponent],
  template: `
    <a routerLink="" class="logoLink">
      <img src="/ngrx-logo-pink.svg" alt="ngrx logo" />
      NgRx
    </a>
    <hr />
    <a routerLink="/workshops" routerLinkActive="active" class="menu-link">
      <mat-icon>co_present</mat-icon>
      Workshops
    </a>
    <a routerLink="/api" routerLinkActive="active" class="menu-link">
      <mat-icon>description</mat-icon>
      API Reference
    </a>
    <a routerLink="/support" routerLinkActive="active" class="menu-link">
      <mat-icon>help</mat-icon>
      Support
    </a>
    <a
      href="https://github.com/ngrx/platform"
      target="__blank"
      class="menu-link"
    >
      <mat-icon>code</mat-icon>
      GitHub
    </a>
    <hr />
    <span class="guideHeader">Guide</span>
    <ngrx-guide-section
      [section]="guideMenu.getMenu()"
      [collapsible]="false"
    ></ngrx-guide-section>
  `,
  styles: [
    `
      .logoLink {
        font-family: 'Oxanium', sans-serif;
        font-weight: 600;
        font-size: 18px;
        color: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
      }

      .logoLink img {
        width: 24px;
      }

      :host {
        display: flex;
        flex-direction: column;
        width: 270px;
        height: 100lvh;
        gap: 16px;
        padding: 32px 24px;
        background-color: #17111a;
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        overflow-y: scroll;
      }

      .menu-link {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        color: rgba(255, 255, 255, 0.64);
        font-family: 'Oxanium', sans-serif;
        font-size: 14px;
        transition: color 0.2s;
      }

      .menu-link mat-icon {
        color: rgba(255, 255, 255, 0.32);
        font-size: 20px;
        transition: color 0.2s;
      }

      .menu-link:hover,
      .menu-link.active {
        color: white;
      }

      .menu-link:hover mat-icon,
      .menu-link.active mat-icon {
        color: #cf8fc5;
      }

      hr {
        border: none;
        border-top: 1px solid rgba(255, 255, 255, 0.12);
        width: 100%;
      }

      .guideHeader {
        display: block;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0 0 0 8px;
        margin: -8px;
      }
    `,
  ],
})
export class MenuComponent {
  guideMenu = inject(GuideMenuService);
}
