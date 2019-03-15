import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Deployment } from './shared/deployment.service';
import { DocumentService, DocumentContents } from './documents/document.service';
import { ElementRef, Component, Input } from '@angular/core';
import { of, Observable, ReplaySubject } from 'rxjs';
import { LocationService } from './shared/location.service';
import { NavigationService, CurrentNodes } from './navigation/navigation.service';
import { ScrollService } from './shared/scroll.service';
import { SearchService } from './search/search.service';
import { TocService, TocItem } from './shared/toc.service';
import { MatProgressBarModule, MatIconModule, MatToolbarModule, MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockAioNotificationComponent,
        MockAioTopMenuComponent,
        MockAioSearchResultsComponent,
        MockAioNavMenuComponent,
        MockAioSelectComponent,
        MockAioModeBannerComponent,
        MockAioDocViewerComponent,
        MockAioDtComponent,
        MockAioLazyCeComponent,
        MockAioFooterComponent
      ],
      imports: [
        MatProgressBarModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Deployment,
          useClass: MockDeployment
        },
        { provide: DocumentService,
          useClass: MockDocumentService
        },
        { provide: ElementRef,
          useClass: MockElementRef
        },
        { provide: LocationService,
          useClass: MockLocationService
        },
        { provide: NavigationService,
          useClass: MockNavigationService
        },
        { provide: ScrollService,
          useClass: MockScrollService
        },
        { provide: SearchService,
          useClass: MockSearchService
        },
        { provide: TocService,
          useClass: MockTocService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockDeployment {
  mode = 'archive';
}

class MockDocumentService {
  currentDocument: Observable<DocumentContents> = of({ id: '1', contents: 'contents' });
}

class MockElementRef {
  nativeElement: Element;
}

class MockLocationService {
  currentPath = of('path');
  replace = () => {};
  go = () => {};
  handleAnchorClick = () => true;
  setSearch = () => {};
  search = () => {};
}

class MockNavigationService {
  currentNodes: Observable<CurrentNodes> = of({ 'view': { url: 'path', view: 'view', nodes: []}})
  versionInfo = of();
  navigationViews = of();
}

class MockScrollService {
  scroll = () => {};
  scrollToTop = () => {};
}

class MockSearchService {
  initWorker = () => of(true);
  search = () => of();
}

class MockTocService {
  tocList = new ReplaySubject<TocItem[]>(1);
}

@Component({
  selector: 'aio-notification',
  template: ''
})
class MockAioNotificationComponent {
  @Input() dismissOnContentClick;
}

@Component({
  selector: 'aio-top-menu',
  template: ''
})
class MockAioTopMenuComponent {
  @Input() nodes;
}

@Component({
  selector: 'aio-search-results',
  template: ''
})
class MockAioSearchResultsComponent {
  @Input() searchResults;
}

@Component({
  selector: 'aio-nav-menu',
  template: ''
})
class MockAioNavMenuComponent {
  @Input() nodes;
  @Input() currentNode;
  @Input() isWide;
}

@Component({
  selector: 'aio-select',
  template: ''
})
class MockAioSelectComponent {
  @Input() options;
  @Input() selected;
}

@Component({
  selector: 'aio-mode-banner',
  template: ''
})
class MockAioModeBannerComponent {
  @Input() mode;
  @Input() version;
}

@Component({
  selector: 'aio-doc-viewer',
  template: ''
})
class MockAioDocViewerComponent {
  @Input() doc;
}

@Component({
  selector: 'aio-dt',
  template: ''
})
class MockAioDtComponent {
  @Input() on;
  @Input() doc;
}

@Component({
  selector: 'aio-lazy-ce',
  template: ''
})
class MockAioLazyCeComponent { }

@Component({
  selector: 'aio-footer',
  template: ''
})
class MockAioFooterComponent {
  @Input() nodes;
  @Input() versionInfo;
}
