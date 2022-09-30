import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithCustomElementComponent } from '../element-registry';
import { ContactFormComponent } from './contact-form.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [CommonModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule],
    declarations: [ ContactFormComponent],
})
export class ContactFormModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = ContactFormComponent;
}
