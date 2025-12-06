import {
  Component,
  inject,
  signal,
  ElementRef,
  HostListener,
} from '@angular/core';
import {
  NavigationNode,
  VersionInfoService,
} from '../services/versionInfo.service';

import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngrx-version-navigation',
  template: `
    @if (versions() && versions().length > 0) {
    <div class="version-navigation">
      <button
        (click)="toggleVisibility()"
        class="version-toggle-btn"
        type="button"
      >
        <span>v{{ currentVersion }}</span>
        <span class="arrow-icon" [class.rotated]="isVisible()">▼</span>
      </button>

      <div class="version-list" [class.hidden]="!isVisible()">
        <ul>
          @for (version of versions(); track version.title) {
          <li>
            <a [href]="version.url">
              {{ version.title }}
            </a>
          </li>
          }
        </ul>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .version-toggle-btn {
        width: 100%;
        padding: 0.5rem 1rem;
        background-color: #241b28;
        color: #ffffffa3;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .arrow-icon {
        display: inline-block;
        transition: transform 0.3s ease;
        font-size: 0.6rem;
      }

      .arrow-icon.rotated {
        transform: rotate(180deg);
      }

      .version-toggle-btn:hover {
        background-color: #2b1f31;
      }

      .version-list {
        background-color: #0d0a0f;
      }

      .version-list.hidden {
        display: none;
      }

      .version-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .version-list li {
        border-bottom: 1px solid #17111a;
        font-size: 0.9rem;
      }

      .version-list li:last-child {
        border-bottom: none;
      }

      .version-list a {
        display: block;
        padding: 0.25rem 1rem;
        text-decoration: none;
        color: #ffffffa3;
        transition: background-color 0.2s ease;
      }

      .version-list a:hover {
        background-color: #2b1f31;
      }
    `,
  ],
})
export class VersionNavigationComponent {
  private versionInfoService = inject(VersionInfoService);
  private elementRef = inject(ElementRef);

  public versions = toSignal(this.versionInfoService.getVersions(), {
    initialValue: [] as NavigationNode[],
  });

  public currentVersion = this.versionInfoService.getCurrentVersion();
  public isVisible = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isVisible.set(false);
    }
  }

  public toggleVisibility(): void {
    this.isVisible.update((visible) => !visible);
  }
}
