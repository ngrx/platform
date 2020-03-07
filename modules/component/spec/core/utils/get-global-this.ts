import { default as globalThis } from './global-this';
export function getGlobalThis(): any {
  // @ TODO discuss with ngRx-Team
  return globalThis as any;
}
