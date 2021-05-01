import { CirclesModule } from './circles.module';

describe('CirclesModule', () => {
    let circlesModule: CirclesModule;

    beforeEach(() => {
        circlesModule = new CirclesModule();
    });

    it('should create an instance', () => {
        expect(circlesModule).toBeTruthy();
    });
});
