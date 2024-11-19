import 'jest-preset-angular/setup-jest';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });
global.structuredClone = (v) => JSON.parse(JSON.stringify(v));
