import { ReflectiveInjector } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Effect } from '../src/effects';
import { EffectsSubscription } from '../src/effects-subscription';


describe('Effects Subscription', () => {
  it('should add itself to a parent subscription if one exists', () => {
    const observer: any = { next() { } };
    const root = new EffectsSubscription(observer, undefined, undefined);

    spyOn(root, 'add');
    const child = new EffectsSubscription(observer, root, undefined);

    expect(root.add).toHaveBeenCalledWith(child);
  });

  it('should unsubscribe for all effects when destroyed', () => {
    const observer: any = { next() { } };
    const subscription = new EffectsSubscription(observer, undefined, undefined);

    spyOn(subscription, 'unsubscribe');
    subscription.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });

  it('should merge effects instances and subscribe them to the observer', () => {
    class Source {
      @Effect() a$ = of('a');
      @Effect() b$ = of('b');
      @Effect() c$ = of('c');
    }
    const instance = new Source();
    const observer: any = { next: jasmine.createSpy('next') };

    const subscription = new EffectsSubscription(observer, undefined, [ instance ]);

    expect(observer.next).toHaveBeenCalledTimes(3);
    expect(observer.next).toHaveBeenCalledWith('a');
    expect(observer.next).toHaveBeenCalledWith('b');
    expect(observer.next).toHaveBeenCalledWith('c');
  });
});