import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
Object.assign(global, { TextDecoder, TextEncoder });
global.structuredClone = (v) => JSON.parse(JSON.stringify(v));
