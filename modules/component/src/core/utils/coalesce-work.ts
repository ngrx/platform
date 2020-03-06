export interface CoalescingContext {
  executionContextId: number;
}

export interface CoalesceConfig {
  leading?: boolean;
  trailing?: boolean;
  context: CoalescingContext;
  executionContextRef: (cb: () => void) => number;
}

export function getCoalesceWorkConfig(
  cfg: CoalesceConfig = {
    leading: false,
    trailing: true,
    context: (window as unknown) as CoalescingContext,
    executionContextRef: requestAnimationFrame.bind(window),
  }
): CoalesceConfig {
  return {
    leading: true,
    trailing: false,
    context: (window as unknown) as CoalescingContext,
    executionContextRef: requestAnimationFrame.bind(window),
    ...cfg,
  };
}

export function isScheduling(cfg: CoalesceConfig): boolean {
  return (
    cfg.context.executionContextId !== -1 &&
    cfg.context.executionContextId !== undefined
  );
}

export function coalesceWork(work: () => void, cfg: CoalesceConfig) {
  const preparedCfg = getCoalesceWorkConfig(cfg);
  // If a executionContext is already scheduled
  // do nothing
  if (isScheduling(preparedCfg)) {
    return;
  }

  // If NO execution is scheduled
  // request a new executionContextId and assign its it to `PushPipe.rid`
  preparedCfg.context.executionContextId = preparedCfg.executionContextRef(
    () => {
      // Reset requestAnimationFrameId
      preparedCfg.context.executionContextId = -1;
      // Logic here will get buffered in the micro task queue and executed only ones
      work();
    }
  );
}
