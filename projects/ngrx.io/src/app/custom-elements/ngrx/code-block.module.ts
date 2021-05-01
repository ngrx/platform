import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './code-block.component';
import { WithCustomElementComponent } from '../element-registry';
import { PrettyPrinter } from '../code/pretty-printer.service';

@NgModule({
    imports: [CommonModule],
    declarations: [CodeBlockComponent],
    exports: [CodeBlockComponent],
    entryComponents: [CodeBlockComponent],
    providers: [PrettyPrinter],
})
export class CodeBlockModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = CodeBlockComponent;
}
