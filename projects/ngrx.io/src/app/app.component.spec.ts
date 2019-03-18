import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Deployment } from './shared/deployment.service';
import { DocumentService, DocumentContents } from './documents/document.service';
import { ElementRef, Component, Input } from '@angular/core';
import { of, Observable, ReplaySubject } from 'rxjs';
import { LocationService } from './shared/location.service';
import { NavigationService, CurrentNodes, VersionInfo, NavigationViews } from './navigation/navigation.service';
import { ScrollService } from './shared/scroll.service';
import { SearchService } from './search/search.service';
import { TocService, TocItem } from './shared/toc.service';
import { MatProgressBarModule, MatIconModule, MatToolbarModule, MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockSearchService } from 'testing/search.service';
import { NotificationComponent } from './layout/notification/notification.component';

const hideToCBreakPoint = 800;

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let searchService: SearchService;
  let deployment: Deployment;
  let locationService: LocationService;
  let locationServiceReplaceSpy: jasmine.Spy;
  let scrollService: ScrollService;
  let tocService: TocService;

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
        {
          provide: LocationService,
          useClass: MockLocationService,
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
    component.notification = { showNotification: 'show' } as NotificationComponent;
    spyOn(component, 'onResize').and.callThrough();
    searchService = TestBed.get(SearchService);
    deployment = TestBed.get(Deployment);
    locationService = TestBed.get(LocationService);
    locationServiceReplaceSpy = spyOn(locationService, 'replace');
    scrollService = TestBed.get(ScrollService);
    tocService = TestBed.get(TocService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the currentDocument from the DocumentService', () => {
      expect(component.currentDocument).toEqual({ id: '1', contents: 'contents' });
    });

    it('should size the window', () => {
      expect(component.onResize).toHaveBeenCalledTimes(1);
    });

    it('should initialize the search worker', () => {
      expect(searchService.initWorker).toHaveBeenCalledWith('app/search/search-worker.js', 2000);
    });

    describe('archive redirection', () => {

    it('should redirect to docs if we are in archive mode and are not hitting a docs, api, guide, or tutorial page', () => {
      deployment.mode = 'archive';
      locationService.currentPath = of('events');
      component.ngOnInit();
      expect(locationService.replace).toHaveBeenCalledWith('docs');
    });

    it('should not redirect to docs if we are hitting a docs page', () => {
      deployment.mode = 'archive';
      locationService.currentPath = of('docs');
      locationServiceReplaceSpy.calls.reset();
      component.ngOnInit();
      expect(locationService.replace).not.toHaveBeenCalled();
    });

    it('should not redirect to docs if we are hitting a api page', () => {
      deployment.mode = 'archive';
      locationService.currentPath = of('api');
      locationServiceReplaceSpy.calls.reset();
      component.ngOnInit();
      expect(locationService.replace).not.toHaveBeenCalled();
    });

    it('should not redirect to docs if we are hitting a guide page', () => {
      deployment.mode = 'archive';
      locationService.currentPath = of('guide');
      locationServiceReplaceSpy.calls.reset();
      component.ngOnInit();
      expect(locationService.replace).not.toHaveBeenCalled();
    });

    it('should not redirect to docs if we are hitting a tutorial page', () => {
      deployment.mode = 'archive';
      locationService.currentPath = of('tutorial');
      locationServiceReplaceSpy.calls.reset();
      component.ngOnInit();
      expect(locationService.replace).not.toHaveBeenCalled();
    });
  });

    it('should auto scroll if the path changes while on the current page', () => {
      component.currentPath = 'docs';
      locationService.currentPath = of('docs');
      spyOn(scrollService, 'scroll');
      component.ngOnInit();
      expect(scrollService.scroll).toHaveBeenCalledTimes(1);
    });

    it('should not auto scroll if the path changes to a different page', () => {
      component.currentPath = 'docs';
      locationService.currentPath = of('events');
      spyOn(scrollService, 'scroll');
      component.ngOnInit();
      expect(scrollService.scroll).not.toHaveBeenCalled();
    });

    describe('version picker', () => {
      it('should contain next and stable by default', () => {
        expect(component.docVersions).toContain({ title: 'next', url: 'https://next.ngrx.io' });
        expect(component.docVersions).toContain({ title: 'stable (v6.3)', url: 'https://ngrx.io' });
      });

      it('should add the current version if in archive mode', () => {
        deployment.mode = 'archive';
        component.ngOnInit();
        expect(component.docVersions).toContain({ title: 'v6 (v6.3)'});
      });

      it('should find the current version by deployment mode and append the raw version info to the title', () => {
        expect(component.currentDocVersion.title).toBe('stable (v6.3)');
      });

      it('should find the current version by the current maajor version and append the raw version info to the title', () => {
        deployment.mode = 'archive';
        component.ngOnInit();
        expect(component.currentDocVersion.title).toBe('v6 (v6.3)');
      });
    });

    describe('hasFloatingToc', () => {
      it('should initially be false', () => {
        const fixture2 = TestBed.createComponent(AppComponent);
        const component2 = fixture2.componentInstance;

        expect(component2.hasFloatingToc).toBe(false);
      });

      it('should be false on narrow screens', () => {
        component.onResize(hideToCBreakPoint - 1);

        tocService.tocList.next([{}, {}, {}] as TocItem[]);
        expect(component.hasFloatingToc).toBe(false);

        tocService.tocList.next([]);
        expect(component.hasFloatingToc).toBe(false);

        tocService.tocList.next([{}, {}, {}] as TocItem[]);
        expect(component.hasFloatingToc).toBe(false);
      });

      it('should be true on wide screens unless the toc is empty', () => {
        component.onResize(hideToCBreakPoint + 1);

        tocService.tocList.next([{}, {}, {}] as TocItem[]);
        expect(component.hasFloatingToc).toBe(true);

        tocService.tocList.next([]);
        expect(component.hasFloatingToc).toBe(false);

        tocService.tocList.next([{}, {}, {}] as TocItem[]);
        expect(component.hasFloatingToc).toBe(true);
      });

      it('should be false when toc is empty', () => {
        tocService.tocList.next([]);

        component.onResize(hideToCBreakPoint + 1);
        expect(component.hasFloatingToc).toBe(false);

        component.onResize(hideToCBreakPoint - 1);
        expect(component.hasFloatingToc).toBe(false);

        component.onResize(hideToCBreakPoint + 1);
        expect(component.hasFloatingToc).toBe(false);
      });

      it('should be true when toc is not empty unless the screen is narrow', () => {
        tocService.tocList.next([{}, {}, {}] as TocItem[]);

        component.onResize(hideToCBreakPoint + 1);
        expect(component.hasFloatingToc).toBe(true);

        component.onResize(hideToCBreakPoint - 1);
        expect(component.hasFloatingToc).toBe(false);

        component.onResize(hideToCBreakPoint + 1);
        expect(component.hasFloatingToc).toBe(true);
      });
    });
  });

  describe('onDocVersionChange', () => {
    it('should navigate to the new version url', () => {
      component.docVersions = [
        { title: 'next', url: 'https://next.ngrx.io'},
        { title: 'stable (v6.3)', url: 'https://ngrx.io' }
      ];
      spyOn(locationService, 'go');
      component.onDocVersionChange(1);
      expect(locationService.go).toHaveBeenCalledTimes(1);
    });
  });
});

// Mock Dependencies

class MockLocationService {
  currentPath = of('path');
  replace = () => {};
  go = () => {};
  handleAnchorClick = () => true;
  setSearch = () => {};
  search = () => {};
}


class MockDeployment {
  mode = 'stable';
}

class MockDocumentService {
  currentDocument: Observable<DocumentContents> = of({ id: '1', contents: 'contents' });
}

class MockElementRef {
  nativeElement: Element;
}

class MockNavigationService {
  currentNodes: Observable<CurrentNodes> = of({ 'view': { url: 'path', view: 'view', nodes: []}})
  versionInfo: Observable<VersionInfo> = of(<VersionInfo>{ major: 6, raw: '6.3'});
  navigationViews: Observable<NavigationViews> = of({ 'docVersions' : [{ title: 'v5'}]});
}

export class MockTocService {
  genToc = jasmine.createSpy('TocService#genToc');
  reset = jasmine.createSpy('TocService#reset');
  tocList = new ReplaySubject<TocItem[]>(1);
}

class MockScrollService {
  scroll = () => {};
  scrollToTop = () => {};
}

// Mock Child Components

@Component({
  selector: 'aio-notification',
  template: ''
})
class MockAioNotificationComponent {
  @Input() dismissOnContentClick;
  showNotification = 'show'
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
