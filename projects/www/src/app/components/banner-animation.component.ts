import { isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  viewChild,
  viewChildren,
} from '@angular/core';

type ComputedLineGroup = {
  group: SVGElement;
  path1: SVGPathElement;
  path2: SVGPathElement;
  path3: SVGPathElement;
  path1Length: number;
  path2Length: number;
  path3Length: number;
  circle: SVGCircleElement;
  ellipse: SVGEllipseElement;
};

type ColorPairs = [dark: string, light: string][];

const COLOR_PAIRS: ColorPairs = [
  ['FF77EA', 'AA1BB6'],
  ['7F00FF', 'B770FF'],
  ['FB9C2D', 'FFCE94'],
];

@Component({
  selector: 'ngrx-banner-animation',
  standalone: true,
  template: `
    <svg
      #svg
      [attr.viewBox]="viewBox"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_232_269)" transform="translate(0 40)">
        <path
          d="M2436.88 841.563L2265.72 840.245L2091.19 739.48L2040.92 646.956L2096.35 614.956L1921.82 514.191L1866.39 546.191L1622.05 405.12L1240.21 504.661L821.333 262.825L938.317 74.3662L833.599 13.9072L861.312 -2.09285L686.782 -102.858L659.069 -86.8579L554.351 -147.317L623.103 -267.623L310.681 -450M2293.99 924.063L2241.08 893.519L2145.39 866.268L2040.67 805.809L1992.69 715.109L1853.07 634.497L1700.12 642.191L1665.21 622.038L1623.11 565.732L1518.39 505.273L1212.49 520.661L793.62 278.825L764.847 134.213L729.941 114.06L666.262 -50.7049L491.732 -151.47L359.301 -195.929L254.583 -256.388L198.097 -385M2168.28 976.486L2043.04 968.18L1973.23 927.874L1890.99 815.392L1752.46 735.41L1650.7 711.659L1442.45 589.426L1184.78 536.661L765.907 294.825L688.902 218.366L584.184 157.907L625.223 53.6011L590.317 33.4481L562.604 49.4481L492.792 9.14213L520.505 -6.85788L401.4 -139.623L261.776 -220.235L31.8203 -289M2029.72 1056.49L2022.52 1020.33L1917.81 959.874L1757.66 931.415L1583.13 830.65L1610.85 814.65L1471.22 734.038L1464.03 697.885L1429.12 677.732L1157.07 552.661L738.194 310.825L528.758 189.907L416.847 93.2951L381.941 73.1421L395.267 -15.1639L290.549 -75.6229L227.93 -79.7759L193.024 -99.9289L178.638 -172.235L-51.3181 -241M1891.15 1136.49L1856.25 1116.33L1849.05 1080.18L1639.62 959.262L1597.52 902.956L1527.71 862.65L1548.23 810.497L1443.51 750.038L1345.98 725.732L1129.35 568.661L710.482 326.825L543.145 262.213L438.426 201.754L431.233 165.601L326.515 105.142L312.129 32.8361L277.223 12.6831L124.272 20.3771L-15.352 -60.235L-79.0309 -225M1808.01 1184.49L1703.3 1124.03L1605.77 1099.72L1431.24 998.956L1451.76 946.803L1347.04 886.344L1374.76 870.344L1332.66 814.038L1193.03 733.426L1101.64 584.661L682.769 342.825L515.432 278.213L480.526 258.06L417.907 253.907L383.001 233.754L333.708 141.295L298.802 121.142L166.371 76.6831L-8.15873 -24.0819L-168.303 -52.5409L-112.877 -84.541L-182.689 -124.847L-356.159 -65M1617.83 1296.18L1629.2 1207.75L1524.48 1147.29L1458.27 1142.06L1355.73 1082.86L1328.02 1098.86L1295.84 1080.28L1391.76 943.66L1320.31 902.409L1255.94 896.747L1047.28 777.273L1073.93 600.661L655.056 358.825C653.747 358.069 612.765 355.742 592.437 354.672L452.813 274.06L230.05 241.448L195.144 221.295L173.565 112.836L33.9405 32.2241L-321.253 -44.8469L-376.679 -12.8469L-411.585 -33M1503.17 1360.49L1488.79 1288.18L1279.35 1167.26L1334.78 1135.26L1090.43 994.191L971.33 861.426L901.518 821.12L1046.22 616.661L627.343 374.825L564.724 370.672L425.1 290.06L369.674 322.06L154.105 325.601L84.293 285.295L153.045 164.989L-56.3912 44.0711L-146.723 55.9181L-522.436 31.0001"
          stroke="url(#paint0_radial_232_269)"
          stroke-opacity="0.72"
          stroke-width="4"
        />
      </g>
      <path
        d="M2436.88 881.563 L2265.72 880.245 L2091.19 779.48 L2040.92 686.956 L2096.35 654.956 L1921.82 554.191 L1866.39 586.191 L1622.05 445.12 L1240.21 544.661 L821.333 302.825 L938.317 114.366 L833.599 53.9072 L861.312 37.9072 L686.782 -62.8579 L659.069 -46.8579 L554.351 -107.31 L623.103 -227.623 L310.681 -410 M2293.99 964.063 L2241.08 933.519 L2145.39 906.268 L2040.67 845.809 L1992.69 755.109 L1853.07 674.497 L1700.12 682.191 L1665.21 662.038 L1623.11 605.732 L1518.39 545.273 L1212.49 560.661 L793.62 318.825 L764.847 174.213 L729.941 154.06 L666.262 -10.7049 L491.732 -111.47 L359.301 -155.929 L254.583 -216.388 L198.097 -345 M2168.28 1016.49 L2043.04 1008.18 L1973.23 967.874 L1890.99 855.392 L1752.46 775.41 L1650.7 751.659 L1442.45 629.426 L1184.78 576.661 L765.907 334.825 L688.902 258.366 L584.184 197.907 L625.223 93.6011 L590.317 73.4481 L562.604 89.4481 L492.792 49.1421 L520.505 33.1421 L401.4 -99.6229 L261.776 -180.235 L31.8203 -249 M2029.72 1096.49 L2022.52 1060.33 L1917.81 999.874 L1757.66 971.415 L1583.13 870.65 L1610.85 854.65 L1471.22 774.038 L1464.03 737.885 L1429.12 717.732 L1157.07 592.661 L738.194 350.825 L528.758 229.907 L416.847 133.295 L381.941 113.142 L395.267 24.8361 L290.549 -35.6229 L227.93 -39.7759 L193.024 -59.9289 L178.638 -132.235 L-51.3181 -201 M1891.15 1176.49 L1856.25 1156.33 L1849.05 1120.18 L1639.62 999.262 L1597.52 942.956 L1527.71 902.65 L1548.23 850.497 L1443.51 790.038 L1345.98 765.732 L1129.35 608.661 L710.482 366.825 L543.145 302.213 L438.426 241.754 L431.233 205.601 L326.515 145.142 L312.129 72.8361 L277.223 52.6831 L124.272 60.3771 L-15.352 -20.235 L-79.0309 -185 M1808.01 1224.49 L1703.3 1164.03 L1605.77 1139.72 L1431.24 1038.96 L1451.76 986.803 L1347.04 926.344 L1374.76 910.344 L1332.66 854.038 L1193.03 773.426 L1101.64 624.661 L682.769 382.825 L515.432 318.213 L480.526 298.06 L417.907 293.907 L383.001 273.754 L333.708 181.295 L298.802 161.142 L166.371 116.683 L-8.15873 15.9181 L-168.303 -12.5409 L-112.877 -44.541 L-182.689 -84.847 L-356.159 -25 M1617.83 1336.18 L1629.2 1247.75 L1524.48 1187.29 L1458.27 1182.06 L1355.73 1122.86 L1328.02 1138.86 L1295.84 1120.28 L1391.76 983.66 L1320.31 942.409 L1255.94 936.747 L1047.28 817.273 L1073.93 640.661 L655.056 398.825 C653.747 398.069 612.765 395.742 592.437 394.672 L452.813 314.06 L230.05 281.448 L195.144 261.295 L173.565 152.836 L33.9405 72.2241 L-321.253 -4.84695 L-376.679 27.1531 L-411.585 7.00005 M1503.17 1400.49 L1488.79 1328.18 L1279.35 1207.26 L1334.78 1175.26 L1090.43 1034.19 L971.33 901.426 L901.518 861.12 L1046.22 656.661 L627.343 414.825 L564.724 410.672 L425.1 330.06 L369.674 362.06 L154.105 365.601 L84.293 325.29 L153.045 204.989 L-56.3912 84.0711 L-146.723 95.9181 L-522.436 71.0001"
        stroke="url(#lineGradient)"
      />

      <!-- Line 1 -->
      <g #lineGroup>
        <path
          d="M686.782 -62.8579 L861.312 37.9072 L833.599 53.9072 L938.317 114.366 L821.333 302.825"
        />
        <path d="M821.333 302.825 L1240.21 544.661" />
        <path d="M1240.21 544.661 L1622.05 445.12 L1866.39 586.191" />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="821.333" cy="302.825" r="3" />
      </g>

      <!-- Line 2 -->
      <g #lineGroup>
        <path
          d="M666.262 -10.7049 L729.941 154.06 L764.847 174.213 L793.62 318.825"
        />
        <path d="M793.62 318.825  L1212.49 560.661" />
        <path
          d="M1212.49 560.661 L1518.39 545.273 L1623.11 605.732 L1665.21 662.038 L1700.12 682.191 L1853.07 674.497 L2293.99 964.063"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="729.941" cy="154.06" r="3" />
      </g>

      <!-- Line 3 -->
      <g #lineGroup>
        <path
          d="M401.4 -99.6229 L520.505 33.1421 L492.792 49.1421 L562.604 89.4481 L590.317 73.4481 L625.223 93.6011 L584.184 197.907 L688.902 258.366 L765.907 334.825"
        />
        <path d="M765.907 334.825 L1184.78 576.661" />
        <path
          d="M1184.78 576.661 L1442.45 629.426 L1650.7 751.659 L1752.46 775.41 L1890.99 855.392"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="520.505" cy="33.1421" r="3" />
      </g>

      <!-- Line 4 -->
      <g #lineGroup>
        <path
          d="M290.549 -35.6229 L395.267 24.8361 L381.941 113.142 L416.847 133.295 L528.758 229.907 L738.194 350.825"
        />
        <path d="M738.194 350.825 L1157.07 592.661" />
        <path
          d="M1157.07 592.661 L1429.12 717.732 L1464.03 737.885 L1471.22 774.038 L1610.85 854.65 L1583.13 870.65 L1757.66 971.415 L1917.81 999.874"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="395.267" cy="24.8361" r="3" />
      </g>

      <!-- Line 5 -->
      <g #lineGroup>
        <path
          d="M-15.352 -20.235 L124.272 60.3771 L277.223 52.6831 L312.129 72.8361 L326.515 145.142 L431.233 205.601 L438.426 241.754 L543.145 302.213 L710.482 366.825"
        />
        <path d="M710.482 366.825 L1129.35 608.661" />
        <path
          d="M1129.35 608.661 L1345.98 765.732 L1443.51 790.038 L1548.23 850.497 L1527.71 902.65 L1597.52 942.956 L1639.62 999.262 L1849.05 1120.18"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="1129.35" cy="608.661" r="3" />
      </g>

      <!-- Line 6 -->
      <g #lineGroup>
        <path
          d="M-8.15873 15.9181 L166.371 116.683 L298.802 161.142 L333.708 181.295 L383.001 273.754 L417.907 293.907 L480.526 298.06 L515.432 318.213 L682.769 382.825"
        />
        <path d="M682.769 382.825 L1101.64 624.661" />
        <path
          d="M1101.64 624.661 L1193.03 773.426 L1332.66 854.038 L1374.76 910.344 L1347.04 926.344 L1451.76 986.803 L1431.24 1038.96 L1605.77 1139.72"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="166.371" cy="116.683" r="3" />
      </g>

      <!-- Line 7 -->
      <g #lineGroup>
        <path
          d="M-321.253 -4.84695 L33.9405 72.2241 L173.565 152.836 L195.144 261.295 L230.05 281.448 L452.813 314.06 L592.437 394.672 C612.765 395.742 653.747 398.069 655.056 398.825"
        />
        <path d="M655.056 398.825 L1073.93 640.661" />
        <path
          d="M1073.93 640.661 L1047.28 817.273 L1255.94 936.747 L1320.31 942.409 L1391.76 983.66 L1295.84 1120.28"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="1073.93" cy="640.661" r="3" />
      </g>

      <!-- Line 8 -->
      <g #lineGroup>
        <path
          d="M-56.3912 84.0711 L153.045 204.989 L84.293 325.29 L154.105 365.601 L369.674 362.06 L425.1 330.06 L564.724 410.672 L627.343 414.825"
        />
        <path d="M627.343 414.825 L1046.22 656.661" />
        <path
          d="M1046.22 656.661 L901.518 861.12 L971.33 901.426 L1090.43 1034.19 L1334.78 1175.26"
        />
        <ellipse
          cx="821.333"
          cy="302.825"
          rx="3"
          ry="6"
          filter="url(#ellipseFilter)"
        />
        <circle cx="153.045" cy="204.989" r="3" />
      </g>

      <defs>
        <radialGradient
          id="lineGradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(915.654 500.281) rotate(33.9338) scale(1416.97 2755.16)"
        >
          <stop stop-color="#B1219B" stop-opacity="0.24" />
          <stop offset="0.385" stop-color="#8A1A79" stop-opacity="0.48" />
          <stop offset="1" stop-color="#FB9C2D" />
        </radialGradient>
        <filter
          id="ellipseFilter"
          x="-30px"
          y="-30px"
          width="60px"
          height="60px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>

        <filter
          id="filter0_f_232_269"
          x="-570.715"
          y="-498.995"
          width="3055.63"
          height="1907.64"
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
          <feGaussianBlur
            stdDeviation="24"
            result="effect1_foregroundBlur_232_269"
          />
        </filter>
        <radialGradient
          id="paint0_radial_232_269"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(915.654 460.281) rotate(33.9338) scale(1416.97 2755.16)"
        >
          <stop stop-color="#B1219B" stop-opacity="0" />
          <stop offset="0.385" stop-color="#8A1A79" stop-opacity="0.3" />
          <stop offset="1" stop-color="#FB9C2D" />
        </radialGradient>
      </defs>
    </svg>
  `,
})
export class BannerAnimationComponent implements AfterViewInit, OnDestroy {
  WIDTH = 1832;
  HEIGHT = 1000;
  viewBox = `0 0 ${this.WIDTH} ${this.HEIGHT}`;
  animateRef?: number;
  setTimeoutRef?: number;
  hostRef = inject(ElementRef);
  platformId = inject(PLATFORM_ID);
  svgRef = viewChild.required<ElementRef<SVGElement>>('svg');
  lineGroupRefs = viewChildren<ElementRef<SVGPathElement>>('lineGroup');
  lineGroups = computed(() => {
    return this.lineGroupRefs().map((ref, index): ComputedLineGroup => {
      const group = ref.nativeElement;
      const path1 = group.querySelector<SVGPathElement>('path:nth-child(1)');
      const path2 = group.querySelector<SVGPathElement>('path:nth-child(2)');
      const path3 = group.querySelector<SVGPathElement>('path:nth-child(3)');
      const circle = group.querySelector('circle');
      const ellipse = group.querySelector('ellipse');

      if (!path1 || !path2 || !path3) {
        throw new Error(`Missing path elements in line group ${index}`);
      }

      if (!circle) {
        throw new Error(`Missing circle element in line group ${index}`);
      }

      if (!ellipse) {
        throw new Error(`Missing ellipse element in line group ${index}`);
      }

      const path1Length = this.getLengthOfPath(path1);
      const path2Length = this.getLengthOfPath(path2);
      const path3Length = this.getLengthOfPath(path3);

      return {
        group,
        path1,
        path2,
        path3,
        path1Length,
        path2Length,
        path3Length,
        circle,
        ellipse,
      };
    });
  });

  moveCircleInLineGroup(
    {
      path1,
      path2,
      path3,
      path1Length,
      path2Length,
      path3Length,
      circle,
      ellipse,
    }: ComputedLineGroup,
    progress: number
  ) {
    const LINE_1_DURATION = 0.4;
    const LINE_2_DURATION = 0.2;
    const LINE_3_DURATION = 0.4;

    if (progress < LINE_1_DURATION) {
      const innerProgress = progress / LINE_1_DURATION;
      const distance = path1Length * innerProgress;
      const point = path1.getPointAtLength(distance);
      circle.setAttribute('cx', `${point.x}`);
      circle.setAttribute('cy', `${point.y}`);
      ellipse.setAttribute('cx', `${point.x}`);
      ellipse.setAttribute('cy', `${point.y}`);
    } else if (progress < LINE_1_DURATION + LINE_2_DURATION) {
      const innerProgress = (progress - LINE_1_DURATION) / LINE_2_DURATION;
      const distance = path2Length * innerProgress;
      const point = path2.getPointAtLength(distance);
      circle.setAttribute('cx', `${point.x}`);
      circle.setAttribute('cy', `${point.y}`);
      ellipse.setAttribute('cx', `${point.x}`);
      ellipse.setAttribute('cy', `${point.y}`);
    } else {
      const innerProgress =
        (progress - (LINE_1_DURATION + LINE_2_DURATION)) / LINE_3_DURATION;
      const distance = path3Length * innerProgress;
      const point = path3.getPointAtLength(distance);
      circle.setAttribute('cx', `${point.x}`);
      circle.setAttribute('cy', `${point.y}`);
      ellipse.setAttribute('cx', `${point.x}`);
      ellipse.setAttribute('cy', `${point.y}`);
    }
  }

  startCircleAnimation() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const CIRCLE_ANIMATION_DURATION = 7_500;
    const CIRCLE_ANIMATION_DELAY = 2_500;

    const circleAnimationStart = Date.now();

    for (const { circle, ellipse } of this.lineGroups()) {
      const [dark, light] =
        COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)];
      circle.setAttribute('fill', `#${dark}`);
      ellipse.setAttribute('fill', `#${light}`);
    }

    const animate = () => {
      const now = Date.now();
      const elapsed = now - circleAnimationStart;

      const progress = elapsed / CIRCLE_ANIMATION_DURATION;

      this.lineGroups().forEach((lineGroup) => {
        this.moveCircleInLineGroup(lineGroup, progress);
      });

      if (progress < 1) {
        this.animateRef = requestAnimationFrame(animate);
      } else {
        this.setTimeoutRef = setTimeout(() => {
          this.startCircleAnimation();
        }, CIRCLE_ANIMATION_DELAY) as unknown as number;
      }
    };

    this.animateRef = requestAnimationFrame(animate);
  }

  resizeSvgToCoverSelf() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.svgRef().nativeElement.setAttribute('width', `${width}`);
        this.svgRef().nativeElement.setAttribute('height', `${height}`);
      }
    });

    resizeObserver.observe(this.hostRef.nativeElement);
  }

  ngAfterViewInit() {
    this.startCircleAnimation();
    this.resizeSvgToCoverSelf();
  }

  ngOnDestroy() {
    if (this.animateRef) {
      cancelAnimationFrame(this.animateRef);
    }
    if (this.setTimeoutRef) {
      clearTimeout(this.setTimeoutRef);
    }
  }

  private getLengthOfPath(pth: SVGPathElement) {
    if (isPlatformServer(this.platformId)) {
      return 0;
    }

    return pth.getTotalLength();
  }
}
