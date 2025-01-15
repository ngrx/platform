import { TextEncoder, TextDecoder } from 'util';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
Object.assign(global, { TextDecoder, TextEncoder });
