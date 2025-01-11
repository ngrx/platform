import 'zone.js/plugins/zone-legacy';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
Object.assign(global, { TextDecoder, TextEncoder });
