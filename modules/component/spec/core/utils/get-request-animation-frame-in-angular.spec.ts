import {
  getGlobalThis,
  getRequestAnimationFrameInAngular,
} from '../../../src/core';

function zoneRequestAnimationFrame() {
  return 'zoneRequestAnimationFrame';
}

function normalRequestAnimationFrame() {
  return 'normalRequestAnimationFrame';
}

describe('getRequestAnimationFrameInAngular', () => {
  beforeEach(() => {
    getGlobalThis().__zone_symbol__requestAnimationFrame = undefined;
    getGlobalThis().requestAnimationFrame = undefined;
  });

  it('should return un-patched RAF if in zone-full mode', () => {
    getGlobalThis().__zone_symbol__requestAnimationFrame = zoneRequestAnimationFrame;
    const rafRef = getRequestAnimationFrameInAngular();

    expect(rafRef).toBeDefined();
    expect(typeof rafRef === 'function').toBe(true);
    expect(rafRef() === 'zoneRequestAnimationFrame').toBe(true);
  });

  it('should return default RAF function if in zone-less mode', () => {
    getGlobalThis().requestAnimationFrame = normalRequestAnimationFrame;
    const rafRef = getRequestAnimationFrameInAngular();

    expect(rafRef).toBeDefined();
    expect(typeof rafRef === 'function').toBe(true);
    expect(rafRef() === 'normalRequestAnimationFrame').toBe(true);
  });

  it('should return a function if on server', () => {
    const rafRef = getRequestAnimationFrameInAngular();

    expect(rafRef).toBeDefined();
    expect(typeof rafRef === 'function').toBe(true);
  });
});
