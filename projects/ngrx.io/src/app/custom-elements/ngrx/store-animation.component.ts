import { Component } from '@angular/core';

@Component({
    selector: 'ngrx-store-animation',
    template: `
    <div class="services">
      <div class="store"></div>
      <div class="dispatcher"></div>
    </div>

    <div class="state-changes-wrapper">
      <ngrx-circles class="state-changes" color="primary"></ngrx-circles>
    </div>
    <div class="actions-wrapper">
      <ngrx-circles class="actions" color="accent"></ngrx-circles>
    </div>
  `,
    styles: [
        `
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      :host {
        display: block;
        width: 200px;
        height: 200px;
        position: relative;
      }

      .state-changes-wrapper,
      .actions-wrapper {
        position: absolute;
        top: 0px;
        left: 0px;
        display: block;
        width: 200px;
        height: 200px;
        animation: spin 40s infinite linear;
        animation-direction: reverse;
      }

      .state-changes-wrapper {
        clip-path: inset(0 50% 0 0);
      }

      .actions-wrapper {
        clip-path: inset(0 0 0 50%);
      }

      .state-changes,
      .actions {
        position: absolute;
        display: block;
        top: 0px;
        left: 0px;
        width: 200px;
        height: 200px;
        animation: spin 10s infinite linear;
      }

      .services {
        position: absolute;
        z-index: 10;
        top: 0px;
        left: 0px;
        width: 200px;
        height: 200px;
        animation: spin 40s infinite linear;
        animation-direction: reverse;
      }

      .store,
      .dispatcher {
        display: block;
        position: absolute;
        width: 28px;
        height: 28px;
        border-radius: 28px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      }

      .store {
        top: 0px;
        left: 86px;
      }

      .dispatcher {
        bottom: 0px;
        left: 86px;
      }
    `,
    ],
})
export class StoreAnimationComponent {}
