import { StoreAnimationModule } from './store-animation.module';

describe('StoreAnimationModule', () => {
    let storeAnimationModule: StoreAnimationModule;

    beforeEach(() => {
        storeAnimationModule = new StoreAnimationModule();
    });

    it('should create an instance', () => {
        expect(storeAnimationModule).toBeTruthy();
    });
});
