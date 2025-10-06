/// <reference types="vite/client" />
import type { StackblitzConfig } from './tools/vite-ngrx-stackblitz.plugin';

declare module '*/stackblitz.yml' {
  const value: StackblitzConfig;
  export default value;
}
