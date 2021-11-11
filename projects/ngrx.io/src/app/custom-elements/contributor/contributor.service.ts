import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Contributor, ContributorGroup } from './contributors.model';

// TODO(andrewjs): Look into changing this so that we don't import the service just to get the const
import { CONTENT_URL_PREFIX } from 'app/documents/document.service';

const contributorsPath = CONTENT_URL_PREFIX + 'contributors.json';
const knownGroups = ['Core', 'Contributor', 'Community'];

@Injectable()
export class ContributorService {
    contributors: Observable<ContributorGroup[]>;
    private _currentContributorsPage$ = new BehaviorSubject(1);
    currentContributorsPage$ = this._currentContributorsPage$.asObservable();

    constructor(private http: HttpClient) {
        this.contributors = this.getContributors();
    }

    updateContributorsCurrentPage(page: number) {
        this._currentContributorsPage$.next(page);
    }

    private getContributors() {
        // combine both contributors.json and github api into one list
        const coreContributors = this.http.get<{ [key: string]: Contributor }>(contributorsPath);
        const commmunityContributors = this.currentContributorsPage$
            .pipe(
                switchMap(currentPage => {
                    return this.http.get<any[]>(`https://api.github.com/repos/ngrx/platform/contributors?per_page=100&page=${currentPage}`)
                        .pipe(
                            map(commContribs => {
                                const data = commContribs.reduce((prev, current) => {
                                    return {
                                        ...prev,
                                        [current.login]: {
                                            name: current.login,
                                            pictureUrl: current.avatar_url,
                                            group: 'Community'
                                        }
                                    };
                                }, {});

                                return data;
                            })
                        );
                })
            );

        const contributors = combineLatest([coreContributors, commmunityContributors])
            .pipe(
                // Create group map
                map(([contribs, commContribs]) => {
                    const contribMap: { [name: string]: Contributor[] } = {};

                    // adds core/contributors
                    Object.keys(contribs).forEach(key => {
                        const contributor = contribs[key];
                        const group = contributor.group;
                        const contribGroup = contribMap[group];
                        if (contribGroup) {
                            contribGroup.push(contributor);
                        } else {
                            contribMap[group] = [contributor];
                        }
                    });

                    // adds community
                    Object.keys(commContribs).forEach(key => {
                        const contributor = commContribs[key];
                        const group = contributor.group;
                        const contribGroup = contribMap[group];
                        if (contribGroup) {
                            contribGroup.push(contributor);
                        } else {
                            contribMap[group] = [contributor];
                        }
                    });

                    return contribMap;
                }),

                // Flatten group map into sorted group array of sorted contributors
                map(cmap => {
                    return Object.keys(cmap)
                        .map(key => {
                            const order = knownGroups.indexOf(key);
                            return {
                                name: key,
                                order: order === -1 ? knownGroups.length : order,
                                contributors: cmap[key].sort(compareContributors),
                            } as ContributorGroup;
                        })
                        .sort(compareGroups);
                })
            );

        return contributors;
    }
}

function compareContributors(l: Contributor, r: Contributor) {
    return l.name.toUpperCase() > r.name.toUpperCase() ? 1 : -1;
}

function compareGroups(l: ContributorGroup, r: ContributorGroup) {
    return l.order === r.order
        ? l.name > r.name
            ? 1
            : -1
        : l.order > r.order
            ? 1
            : -1;
}
