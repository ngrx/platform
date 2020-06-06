import { createRender } from '../../../src/core/cd-aware';
import {
  manualInstanceNgZone,
  MockChangeDetectorRef,
  manualInstanceNoopNgZone,
} from '../../fixtures/fixtures';

describe('renderCreator', () => {
  it('should create', () => {
    const render = createRender({
      ngZone: manualInstanceNgZone,
      cdRef: new MockChangeDetectorRef(),
    });
    expect(render).toBeDefined();
  });

  it('should call markForCheck', () => {
    const cdRef = new MockChangeDetectorRef();
    const render = createRender({ ngZone: manualInstanceNgZone, cdRef });
    render();
    expect(cdRef.detectChanges).toHaveBeenCalledTimes(0);
    expect(cdRef.markForCheck).toHaveBeenCalledTimes(1);
  });

  it('should call detectChanges', () => {
    const cdRef = new MockChangeDetectorRef();
    const render = createRender({ ngZone: manualInstanceNoopNgZone, cdRef });
    render();
    expect(cdRef.detectChanges).toHaveBeenCalledTimes(1);
    expect(cdRef.markForCheck).toHaveBeenCalledTimes(0);
  });
});
