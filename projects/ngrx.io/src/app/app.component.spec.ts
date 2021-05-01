import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Deployment } from './shared/deployment.service';
import {
    DocumentService,
    DocumentContents,
} from './documents/document.service';
import { ElementRef, Component, Input } from '@angular/core';
import { of, Observable, ReplaySubject } from 'rxjs';
import { LocationService } from './shared/location.service';
import {
    NavigationService,
    CurrentNodes,
    VersionInfo,
    NavigationViews,
} from './navigation/navigation.service';
import { ScrollService } from './shared/scroll.service';
import { SearchService } from './search/search.service';
import { TocService, TocItem } from './shared/toc.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockSearchService } from 'testing/search.service';
import { NotificationComponent } from './layout/notification/notification.component';
import { By } from '@angular/platform-browser';
import { SearchResultsComponent } from './shared/search-results/search-results.component';

const hideToCBreakPoint = 800;

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let searchService: SearchService;
    let deployment: Deployment;
    let locationService: LocationService;
    let locationServiceReplaceSpy: jasmine.Spy;
    let scrollService: ScrollService;
    let tocService: TocService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    AppComponent,
                    MockMatIconComponent,
                    MockAioNotificationComponent,
                    MockAioTopMenuComponent,
                    SearchResultsComponent,
                    MockAioNavMenuComponent,
                    MockAioSelectComponent,
                    MockAioModeBannerComponent,
                    MockAioDocViewerComponent,
                    MockAioDtComponent,
                    MockAioLazyCeComponent,
                    MockAioFooterComponent,
                    MockAioSearchBoxComponent,
                ],
                imports: [
                    MatProgressBarModule,
                    MatToolbarModule,
                    MatSidenavModule,
                    BrowserAnimationsModule,
                ],
                providers: [
                    {
                        provide: Deployment,
                        useClass: MockDeployment,
                    },
                    {
                        provide: DocumentService,
                        useClass: MockDocumentService,
                    },
                    {
                        provide: ElementRef,
                        useClass: MockElementRef,
                    },
                    {
                        provide: LocationService,
                        useClass: MockLocationService,
                    },
                    {
                        provide: NavigationService,
                        useClass: MockNavigationService,
                    },
                    {
                        provide: ScrollService,
                        useClass: MockScrollService,
                    },
                    {
                        provide: SearchService,
                        useClass: MockSearchService,
                    },
                    {
                        provide: TocService,
                        useClass: MockTocService,
                    },
                ],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        component.notification = {
            showNotification: 'show',
        } as NotificationComponent;
        component.sidenav = { opened: true, toggle: () => {} } as MatSidenav;
        spyOn(component, 'onResize').and.callThrough();
        searchService = TestBed.inject(SearchService);
        deployment = TestBed.inject(Deployment);
        locationService = TestBed.inject(LocationService);
        locationServiceReplaceSpy = spyOn(locationService, 'replace');
        scrollService = TestBed.inject(ScrollService);
        tocService = TestBed.inject(TocService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should set the currentDocument from the DocumentService', () => {
            expect(component.currentDocument).toEqual({
                id: '1',
                contents: 'contents',
            });
        });

        it('should size the window', () => {
            expect(component.onResize).toHaveBeenCalledTimes(1);
        });

        it('should initialize the search worker', () => {
            expect(searchService.initWorker).toHaveBeenCalledWith(
                'app/search/search-worker.js',
                2000
            );
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
                expect(component.docVersions).toContain({
                    title: 'next',
                    url: 'https://next.ngrx.io/docs',
                });
                expect(component.docVersions).toContain({
                    title: 'stable (v6.3)',
                    url: 'https://ngrx.io/docs',
                });
            });

            it('should add the current version if in archive mode', () => {
                deployment.mode = 'archive';
                component.ngOnInit();
                expect(component.docVersions).toContain({ title: 'v6 (v6.3)' });
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
                { title: 'next', url: 'https://next.ngrx.io' },
                { title: 'stable (v6.3)', url: 'https://ngrx.io' },
            ];
            spyOn(locationService, 'go');
            component.onDocVersionChange(1);
            expect(locationService.go).toHaveBeenCalledTimes(1);
        });
        it('should not navigate to new version if it does not define a Url', () => {
            component.docVersions = [
                { title: 'next', url: 'https://next.ngrx.io' },
                { title: 'stable (v6.3)', url: 'https://ngrx.io' },
                { title: 'v1' },
            ];
            spyOn(locationService, 'go');
            component.onDocVersionChange(2);
            expect(locationService.go).not.toHaveBeenCalled();
        });
    });

    describe('onResize', () => {
        it('should set isSideBySide to true if the window width is greater than 992 pixels', () => {
            component.isSideBySide = false;
            component.onResize(993);
            expect(component.isSideBySide).toBeTruthy();
        });

        it('should set isSideBySide to false if the window width is less than or equal to 992 pixels', () => {
            component.isSideBySide = true;
            component.onResize(992);
            expect(component.isSideBySide).toBeFalsy();
        });

        it('should set hasFloatingToc to true if the window width is greater than 800 and the toc list is greater than zero', () => {
            tocService.tocList.next([{}] as TocItem[]);
            component.onResize(801);
            expect(component.hasFloatingToc).toBeTruthy();
        });

        it('should set hasFloatingToc to false if the window width is less than or equal to 800 and the toc list is greater than zero', () => {
            tocService.tocList.next([{}] as TocItem[]);
            component.onResize(800);
            expect(component.hasFloatingToc).toBeFalsy();
        });

        it(
            'should toggle the sidenav closed if it is not a doc page and the screen is wide enough to display menu items ' +
        'in the top-bar',
            () => {
                const sideNavToggleSpy = spyOn(component.sidenav, 'toggle');
                sideNavToggleSpy.calls.reset();
                component.updateSideNav();
                component.onResize(993);
                expect(component.sidenav.toggle).toHaveBeenCalledWith(false);
            }
        );
    });

    // describe('click handler', () => {
    //   it('should hide the search results if we clicked outside both the "search box" and the "search results"', () => {
    //     component.searchElements = new QueryList();
    //     component.searchElements.
    //     console.log(component.searchElements.length);
    //   });
    // });

    describe('search', () => {
        let docViewer: HTMLElement;

        beforeEach(() => {
            const documentViewerDebugElement = fixture.debugElement.query(
                By.css('aio-doc-viewer')
            );
            docViewer = documentViewerDebugElement.nativeElement;
        });

        describe('click handling', () => {
            it('should intercept clicks not on the search elements and hide the search results', () => {
                component.showSearchResults = true;
                fixture.detectChanges();
                // docViewer is a commonly-clicked, non-search element
                docViewer.click();
                expect(component.showSearchResults).toBe(false);
            });

            it('should clear "only" the search query param from the URL', () => {
                // Mock out the current state of the URL query params
                spyOn(locationService, 'search').and.returnValue({
                    a: 'some-A',
                    b: 'some-B',
                    search: 'some-C',
                });
                spyOn(locationService, 'setSearch');
                // docViewer is a commonly-clicked, non-search element
                docViewer.click();
                // Check that the query params were updated correctly
                expect(locationService.setSearch).toHaveBeenCalledWith('', {
                    a: 'some-A',
                    b: 'some-B',
                    search: undefined,
                });
            });

            it('should not intercept clicks on the searchResults', () => {
                component.showSearchResults = true;
                fixture.detectChanges();

                const searchResults = fixture.debugElement.query(
                    By.directive(SearchResultsComponent)
                );
                searchResults.nativeElement.click();
                fixture.detectChanges();

                expect(component.showSearchResults).toBe(true);
            });

            it('should return the result of handleAnchorClick when anchor is clicked', () => {
                const anchorElement: HTMLAnchorElement = document.createElement('a');
                spyOn(locationService, 'handleAnchorClick').and.returnValue(true);
                expect(
                    component.onClick(anchorElement, 1, false, false, true)
                ).toBeTruthy();
                expect(locationService.handleAnchorClick).toHaveBeenCalledTimes(1);
            });
        });
    });

    it('updateHostClasses', () => {
        component.notificationAnimating = true;
        component.hostClasses = '';
        component.updateHostClasses();
        expect(component.hostClasses).toBe(
            'mode-stable sidenav-open page-1 folder-1 view-view aio-notification-show aio-notification-animating'
        );
    });

    describe('updateSideNav', () => {
        it('should preserve the current sidenav open state if view type does not change', () => {
            component.isSideBySide = true;
            component.sidenav.opened = true;
            const toggleSpy = spyOn(component.sidenav, 'toggle');

            component.updateSideNav();
            expect(component.sidenav.toggle).toHaveBeenCalledWith(true);
            expect(component.sidenav.toggle).toHaveBeenCalledTimes(1);

            component.isSideBySide = false;
            toggleSpy.calls.reset();
            component.updateSideNav();
            expect(component.sidenav.toggle).toHaveBeenCalledWith(false);
            expect(component.sidenav.toggle).toHaveBeenCalledTimes(1);
        });

        it('should open if changed from a non sidenav doc to a sidenav doc and close if changed from sidenav doc to non sidenav doc', () => {
            const toggleSpy = spyOn(component.sidenav, 'toggle');
            component.isSideBySide = true;
            component.currentNodes = {
                'SideNav': { url: '', view: '', nodes: [] },
            };
            component.updateSideNav();
            expect(component.sidenav.toggle).toHaveBeenCalledWith(true);
            expect(component.sidenav.toggle).toHaveBeenCalledTimes(1);

            component.currentNodes = {};
            toggleSpy.calls.reset();
            component.updateSideNav();
            expect(component.sidenav.toggle).toHaveBeenCalledWith(false);
            expect(component.sidenav.toggle).toHaveBeenCalledTimes(1);
        });
    });

    describe('restrain scrolling inside an element when the cursor is over it', () => {
        it('should prevent scrolling up when already at the top', () => {
            const scrollUpEvent = {
                deltaY: -1,
                currentTarget: { scrollTop: 0 },
                preventDefault: () => {},
            } as any;
            spyOn(scrollUpEvent, 'preventDefault');
            component.restrainScrolling(scrollUpEvent);
            expect(scrollUpEvent.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should prevent scrolling down when already at the bottom', () => {
            const scrollUpEvent = {
                deltaY: 1,
                currentTarget: {
                    scrollTop: 10,
                    scrollHeight: 20,
                    clientHeight: 10,
                },
                preventDefault: () => {},
            } as any;
            spyOn(scrollUpEvent, 'preventDefault');
            component.restrainScrolling(scrollUpEvent);
            expect(scrollUpEvent.preventDefault).toHaveBeenCalledTimes(1);
        });
    });

    describe('key handling', () => {
        beforeEach(() => {
            spyOn(component, 'focusSearchBox');
            spyOn(component, 'hideSearchResults');
        });

        it('should focus search box on forward slash key "/"', () => {
            component.onKeyUp('/', 190);
            expect(component.focusSearchBox).toHaveBeenCalledTimes(1);
        });

        it('should focus search box on forward slash keycode', () => {
            component.onKeyUp('', 191);
            expect(component.focusSearchBox).toHaveBeenCalledTimes(1);
        });

        it('should hide the search results and focus search box if results are being shown on escape key', () => {
            component.showSearchResults = true;
            component.onKeyUp('Escape', 28);
            expect(component.focusSearchBox).toHaveBeenCalledTimes(1);
            expect(component.hideSearchResults).toHaveBeenCalledTimes(1);
        });

        it('should hide the search results and focus search box if results are being shown on escape keycode', () => {
            component.showSearchResults = true;
            component.onKeyUp('', 27);
            expect(component.focusSearchBox).toHaveBeenCalledTimes(1);
            expect(component.hideSearchResults).toHaveBeenCalledTimes(1);
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
    currentDocument: Observable<DocumentContents> = of({
        id: '1',
        contents: 'contents',
    });
}

class MockElementRef {
    nativeElement: Element;
}

class MockNavigationService {
    currentNodes: Observable<CurrentNodes> = of({
        'view': { url: 'path', view: 'view', nodes: [] },
    });
    versionInfo: Observable<VersionInfo> = of(<VersionInfo>{
        major: 6,
        raw: '6.3',
    });
    navigationViews: Observable<NavigationViews> = of({
        'docVersions': [{ title: 'v5' }],
    });
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
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'mat-icon',
    template: '',
})
class MockMatIconComponent {
    @Input() svgIcon;
}

@Component({
    selector: 'aio-notification',
    template: '',
})
class MockAioNotificationComponent {
    @Input() dismissOnContentClick;
    showNotification = 'show';
}

@Component({
    selector: 'aio-top-menu',
    template: '',
})
class MockAioTopMenuComponent {
    @Input() nodes;
}

@Component({
    selector: 'aio-nav-menu',
    template: '',
})
class MockAioNavMenuComponent {
    @Input() nodes;
    @Input() currentNode;
    @Input() isWide;
}

@Component({
    selector: 'aio-select',
    template: '',
})
class MockAioSelectComponent {
    @Input() options;
    @Input() selected;
}

@Component({
    selector: 'aio-mode-banner',
    template: '',
})
class MockAioModeBannerComponent {
    @Input() mode;
    @Input() version;
}

@Component({
    selector: 'aio-doc-viewer',
    template: '',
})
class MockAioDocViewerComponent {
    @Input() doc;
}

@Component({
    selector: 'aio-dt',
    template: '',
})
class MockAioDtComponent {
    @Input() on;
    @Input() doc;
}

@Component({
    selector: 'aio-lazy-ce',
    template: '',
})
class MockAioLazyCeComponent {}

@Component({
    selector: 'aio-footer',
    template: '',
})
class MockAioFooterComponent {
    @Input() nodes;
    @Input() versionInfo;
}

@Component({
    selector: 'aio-search-box',
    template: '',
})
class MockAioSearchBoxComponent {}
