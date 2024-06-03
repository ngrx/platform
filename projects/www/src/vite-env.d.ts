/// <reference types="vite/client" />
import type { StackblitzConfig } from './tools/vite-ngrx-stackblits.plugin';

declare module '*/stackblitz.yml' {
  const value: StackblitzConfig;
  export default value;
}
