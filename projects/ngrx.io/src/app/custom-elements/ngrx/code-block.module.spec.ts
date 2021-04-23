import { CodeBlockModule } from './code-block.module';

describe('CodeBlockModule', () => {
    let codeBlockModule: CodeBlockModule;

    beforeEach(() => {
        codeBlockModule = new CodeBlockModule();
    });

    it('should create an instance', () => {
        expect(codeBlockModule).toBeTruthy();
    });
});
