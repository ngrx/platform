import 'zone.js/plugins/zone-legacy';
import 'jest-preset-angular/setup-jest';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });
