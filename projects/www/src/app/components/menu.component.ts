import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GuideSectionComponent } from './guide-section.component';
import { GuideMenuService } from '../services/guide-menu.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ngrx-menu',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, GuideSectionComponent],
  template: `
    <div class="mobile-nav-bar">
      <button class="menu-toggle" #toggleBtnRef (click)="toggleMenu()">
        <img src="/ngrx-logo-pink.svg" alt="ngrx logo" />
        <mat-icon>menu</mat-icon>
      </button>
    </div>
    <nav class="sidebar" #sidebarRef [class.open]="isMenuOpen()">
      <button class="close-menu" (click)="closeMenu()">
        <mat-icon class="close-menu-icon">close</mat-icon>
      </button>
      <a routerLink="" class="logoLink" (click)="closeMenu()">
        <img src="/ngrx-logo-pink.svg" alt="ngrx logo" />
        NgRx
      </a>
      <hr />
      <a
        routerLink="/workshops"
        routerLinkActive="active"
        class="menu-link"
        (click)="closeMenu()"
      >
        <mat-icon>co_present</mat-icon>
        Workshops
      </a>
      <a
        routerLink="/api"
        routerLinkActive="active"
        class="menu-link"
        (click)="closeMenu()"
      >
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
    </nav>
  `,
  styles: [
    `
      .mobile-nav-bar {
        position: fixed;
        top: 0;
        display: none;
        background-color: #17111a;
        width: 100%;
        padding: 15px 20px;
        .menu-toggle {
          display: flex;
          align-items: center;
          background-color: transparent;
          border: none;
          cursor: pointer;
          img {
            width: 30px;
            margin-right: 8px;
          }
        }
        @media only screen and (max-width: 1280px) {
          display: block;
        }
      }
      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 32px 24px;
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        @media only screen and (max-width: 1280px) {
          background-color: #17111a;
          position: fixed;
          top: 0;
          left: -270px;
          transition: left 0.3s ease-in-out;
          width: 270px;
          height: 100lvh;
          overflow-y: scroll;
        }
        &.open {
          @media only screen and (max-width: 1280px) {
            display: flex;
            left: 0;
          }
        }
        .close-menu {
          display: none;
          background-color: transparent;
          border: none;
          width: 25px;
          padding: 0;
          @media only screen and (max-width: 1280px) {
            display: block;
          }
          .close-menu-icon {
            cursor: pointer;
          }
        }
      }
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
        z-index: 2;
        width: 270px;
        height: 100lvh;
        background-color: #17111a;
        overflow-y: scroll;
        border-right: 1px solid rgba(255, 255, 255, 0.12);
        @media only screen and (max-width: 1280px) {
          border-right: none;
          width: 0px;
          padding: 0px;
        }
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
  isMenuOpen = signal(false);

  sidebarRef = viewChild.required<ElementRef>('sidebarRef');
  toggleBtnRef = viewChild.required<ElementRef>('toggleBtnRef');

  document = inject(DOCUMENT);

  constructor() {
    effect(() => {
      if (this.isMenuOpen()) {
        this.document.body.classList.add('no-scroll');
      } else {
        this.document.body.classList.remove('no-scroll');
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeSidebarWhenClickedOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isSidebarClicked = this.sidebarRef().nativeElement.contains(target);
    const isToggleBtnClicked =
      this.toggleBtnRef().nativeElement.contains(target);

    if (!isSidebarClicked && !isToggleBtnClicked && this.isMenuOpen()) {
      this.closeMenu();
    }
  }
}
