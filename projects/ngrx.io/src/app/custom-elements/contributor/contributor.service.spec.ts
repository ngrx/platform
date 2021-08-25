import {
    HttpClientTestingModule,
    HttpTestingController,
} from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ContributorService } from './contributor.service';
import { ContributorGroup } from './contributors.model';

describe('ContributorService', () => {
    let injector: Injector;
    let contribService: ContributorService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        injector = TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ContributorService],
        });

        contribService = injector.get<ContributorService>(ContributorService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should make two requests for contributor data', () => {
        contribService.contributors.subscribe();

        const req1 = httpMock.match('generated/contributors.json');
        expect(req1[0].request.url).toBe('generated/contributors.json');

        const req2 = httpMock.match('https://api.github.com/repos/ngrx/platform/contributors?per_page=100&page=1');
        expect(req2[0].request.url).toBe('https://api.github.com/repos/ngrx/platform/contributors?per_page=100&page=1');
    });

    describe('#contributors', () => {
        let contribs: ContributorGroup[];
        let testData: any;

        beforeEach(() => {
            testData = getTestContribs();
            contribService.contributors.subscribe(results => (contribs = results));
            httpMock.expectOne('generated/contributors.json').flush(testData);
            httpMock.expectOne('https://api.github.com/repos/ngrx/platform/contributors?per_page=100&page=1').flush([]);
        });

        it('should reshape the contributor json to expected result', () => {
            const groupNames = contribs.map(g => g.name).join(',');
            expect(groupNames).toEqual('Angular,GDE');
        });

        it('should have expected "GDE" contribs in order', () => {
            const gde = contribs[1];
            const actualAngularNames = gde.contributors.map(l => l.name).join(',');
            const expectedAngularNames = [testData.jeffcross, testData.kapunahelewong]
                .map(l => l.name)
                .join(',');
            expect(actualAngularNames).toEqual(expectedAngularNames);
        });
    });

    it('should do WHAT(?) if the request fails');
});

function getTestContribs() {
    return {
        kapunahelewong: {
            name: 'Kapunahele Wong',
            picture: 'kapunahelewong.jpg',
            website: 'https://github.com/kapunahelewong',
            twitter: 'kapunahele',
            bio: 'Kapunahele is a front-end developer and contributor to angular.io',
            group: 'GDE',
        },
        misko: {
            name: 'Miško Hevery',
            picture: 'misko.jpg',
            twitter: 'mhevery',
            website: 'http://misko.hevery.com',
            bio: 'Miško Hevery is the creator of AngularJS framework.',
            group: 'Angular',
        },
        igor: {
            name: 'Igor Minar',
            picture: 'igor-minar.jpg',
            twitter: 'IgorMinar',
            website: 'https://google.com/+IgorMinar',
            bio: 'Igor is a software engineer at Angular.',
            group: 'Angular',
        },
        kara: {
            name: 'Kara Erickson',
            picture: 'kara-erickson.jpg',
            twitter: 'karaforthewin',
            website: 'https://github.com/kara',
            bio:
        'Kara is a software engineer on the Angular team at Angular and a co-organizer of the Angular-SF Meetup. ',
            group: 'Angular',
        },
        jeffcross: {
            name: 'Jeff Cross',
            picture: 'jeff-cross.jpg',
            twitter: 'jeffbcross',
            website: 'https://twitter.com/jeffbcross',
            bio: 'Jeff was one of the earliest core team members on AngularJS.',
            group: 'GDE',
        },
        naomi: {
            name: 'Naomi Black',
            picture: 'naomi.jpg',
            twitter: 'naomitraveller',
            website: 'http://google.com/+NaomiBlack',
            bio: 'Naomi is Angular\'s TPM generalist and jack-of-all-trades.',
            group: 'Angular',
        },
    };
}
