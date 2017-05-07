import { ReflectiveInjector } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Effect } from '../src/effects';
import { EffectsSubscription } from '../src/effects-subscription';
import { SingletonEffectsService } from '../src/singleton-effects.service';


describe('Effects Subscription', () => {
  it('should add itself to a parent subscription if one exists', () => {
    const observer: any = { next() { } };
    const singletonEffectsService = new SingletonEffectsService();
    const root = new EffectsSubscription(observer, singletonEffectsService, undefined, undefined);

    spyOn(root, 'add');
    const child = new EffectsSubscription(observer, singletonEffectsService, root, undefined);

    expect(root.add).toHaveBeenCalledWith(child);
  });

  it('should unsubscribe for all effects when destroyed', () => {
    const observer: any = { next() { } };
    const singletonEffectsService = new SingletonEffectsService();
    const subscription = new EffectsSubscription(observer, singletonEffectsService, undefined, undefined);

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
    const singletonEffectsService = new SingletonEffectsService();

    const subscription = new EffectsSubscription(observer, singletonEffectsService, undefined, [ instance ]);

    expect(observer.next).toHaveBeenCalledTimes(3);
    expect(observer.next).toHaveBeenCalledWith('a');
    expect(observer.next).toHaveBeenCalledWith('b');
    expect(observer.next).toHaveBeenCalledWith('c');
  });

  it('should not merge duplicate effects instances when a SingletonEffectsService is provided', () => {
    class Source {
      @Effect() a$ = of('a');
      @Effect() b$ = of('b');
      @Effect() c$ = of('c');
    }
    const instance = new Source();
    const observer: any = { next: jasmine.createSpy('next') };
    const singletonEffectsService = new SingletonEffectsService();
    singletonEffectsService.removeExistingAndRegisterNew([ instance ]);

    const subscription = new EffectsSubscription(observer, singletonEffectsService, undefined, [ instance ]);

    expect(observer.next).not.toHaveBeenCalled();
    expect(observer.next).not.toHaveBeenCalledWith('a');
    expect(observer.next).not.toHaveBeenCalledWith('b');
    expect(observer.next).not.toHaveBeenCalledWith('c');
  });
});
