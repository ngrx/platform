import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { AnnouncementBarComponent } from './announcement-bar.component';
import { WithCustomElementComponent } from '../element-registry';

@NgModule({ declarations: [AnnouncementBarComponent], imports: [CommonModule, SharedModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AnnouncementBarModule implements WithCustomElementComponent {
    customElementComponent: Type<any> = AnnouncementBarComponent;
}
