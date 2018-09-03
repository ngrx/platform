import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from './code-block.component';
import { WithCustomElementComponent } from '../element-registry';

@NgModule({
  imports: [CommonModule],
  declarations: [CodeBlockComponent],
  exports: [CodeBlockComponent],
  entryComponents: [CodeBlockComponent],
})
export class CodeBlockModule implements WithCustomElementComponent {
  customElementComponent: Type<any> = CodeBlockComponent;
}
