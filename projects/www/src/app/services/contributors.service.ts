import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import contributorsData from '../data/contributors.json';

export interface ContributorGroup {
  name: string;
  order: number;
  contributors: Contributor[];
}

export interface Contributor {
  group: string;
  name: string;
  picture?: string;
  website?: string;
  twitter?: string;
  bio?: string;
  isFlipped?: boolean;
  pictureUrl?: string;
}

export interface GroupNav {
  name: string;
  order: number;
}

const knownGroups = ['Core', 'Alumni'];

@Injectable({ providedIn: 'root' })
export class ContributorsService {
  getContributors() {
    const contribsObj = contributorsData as { [key: string]: Contributor };
    return of(contribsObj).pipe(
      map((contribs) => {
        const contribMap: { [name: string]: Contributor[] } = {};
        Object.keys(contribs).forEach((key) => {
          const contributor = contribs[key];
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
      map((cmap) => {
        return Object.keys(cmap)
          .map((key) => {
            const order = knownGroups.indexOf(key);
            return {
              name: key,
              order: order === -1 ? knownGroups.length : order,
              contributors: cmap[key].sort(this.compareContributors),
            } as ContributorGroup;
          })
          .sort(this.compareGroups);
      })
    );
  }
  compareContributors(l: Contributor, r: Contributor) {
    return l.name.toUpperCase() > r.name.toUpperCase() ? 1 : -1;
  }

  compareGroups(l: ContributorGroup, r: ContributorGroup) {
    return l.order === r.order
      ? l.name > r.name
        ? 1
        : -1
      : l.order > r.order
      ? 1
      : -1;
  }
}
