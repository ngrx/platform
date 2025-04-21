import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { ApiListComponent } from './api-list.component';
import { ApiService } from './api.service';
import { WithCustomElementComponent } from '../element-registry';

@NgModule({ declarations: [ApiListComponent], imports: [CommonModule, SharedModule], providers: [ApiService, provideHttpClient(withInterceptorsFromDi())] })
export class ApiListModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = ApiListComponent;
}
