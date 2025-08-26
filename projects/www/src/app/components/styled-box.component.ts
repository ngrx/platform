import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'ngrx-styled-box',
  template: `
    <svg
      [attr.viewBox]="viewBox()"
      [attr.width]="width()"
      [attr.height]="height()"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        [attr.width]="width()"
        [attr.height]="height()"
        fill="white"
        fill-opacity="0.04"
      />
      <ellipse
        cx="285.5"
        cy="207"
        rx="114.5"
        ry="47"
        filter="url(#styledBoxEllipseBlur)"
        fill="url(#styledBoxEllipseGradient)"
        class="backgroundBlurShapes"
      />
      <path
        d="M90.4445 99.6809C79.1814 108.189 54.1311 204.578 17.3753 130.24C-19.3804 55.9033 63.3118 92.6761 91.3154 85.1726C119.319 77.669 135.912 69.9287 150.175 56.2242C164.438 42.5197 177.06 -48.3425 230.735 42.6908C284.409 133.724 163.166 63.7242 150.188 67.2014C137.211 70.6787 101.708 91.1726 90.4445 99.6809Z"
        filter="url(#styledBoxBlobBlur)"
        fill="#FB9C2D"
        class="backgroundBlurShapes"
      />
      <defs>
        <filter
          id="styledBoxEllipseBlur"
          x="-77"
          y="-88"
          width="725"
          height="590"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="124" />
        </filter>
        <filter
          id="styledBoxBlobBlur"
          x="-239.881"
          y="-245.322"
          width="732.25"
          height="651.535"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="124" />
        </filter>
        <linearGradient
          id="styledBoxEllipseGradient"
          x1="285.5"
          y1="160"
          x2="285.5"
          y2="254"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#B1219B" />
          <stop offset="1" stop-color="#5306A1" />
        </linearGradient>
      </defs>
    </svg>
    <ng-content></ng-content>
  `,
  styles: [
    `
      :host {
        display: block;
        --background-blur-shapes-rotation: 27deg;
        border-radius: 32px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.12);
        position: relative;
      }

      svg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .backgroundBlurShapes {
        transform: rotate(var(--background-blur-shapes-rotation));
        transform-origin: center;
      }
    `,
  ],
})
export class StyledBoxComponent implements AfterViewInit {
  @HostBinding('style.--background-blur-shapes-rotation')
  readonly rotation = `${Math.round(Math.random() * 360)}deg`;

  hostRef = inject(ElementRef);
  platformId = inject(PLATFORM_ID);
  width = signal<number>(0);
  height = signal<number>(0);
  viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  ngAfterViewInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        const { width, height } =
          this.hostRef.nativeElement.getBoundingClientRect();
        this.width.set(width);
        this.height.set(height);
      }
    });

    resizeObserver.observe(this.hostRef.nativeElement);
  }
}
