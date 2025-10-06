import { Injectable } from '@angular/core';
import {
  ApiMemberSummary,
  CanonicalReference,
  MinimizedApiPackageReport,
  ParsedCanonicalReference,
} from '@ngrx-io/shared';
import { packageNames, packages } from './api-report.min.json';

const modules = import.meta.glob('./**/*.json');

@Injectable({ providedIn: 'root' })
export class ReferenceService {
  getMinifiedApiReport(): MinimizedApiPackageReport {
    return { packageNames, packages } as unknown as MinimizedApiPackageReport;
  }

  loadReferenceData(pkg: string, symbol: string): Promise<ApiMemberSummary> {
    /**
     * Wrapping this up in a Zone-aware promise for server-side rendering
     */
    return new Promise<ApiMemberSummary>((resolve, reject) => {
      const path = `${pkg}/${symbol}`;

      if (!modules[`./${path}.json`]) {
        throw new Error(
          `Module not found: ${pkg}/${path}. Tried loading from ${path}.`
        );
      }

      modules[`./${path}.json`]()
        .then((module) => {
          resolve((module as { default: ApiMemberSummary }).default);
        })
        .catch(reject);
    });
  }

  loadFromCanonicalReference(
    canonicalReference: CanonicalReference
  ): Promise<ApiMemberSummary> {
    const parsed = new ParsedCanonicalReference(canonicalReference);
    const [_ngrx, ...rest] = parsed.package.split('/');

    return this.loadReferenceData(rest.join('/'), parsed.name);
  }
}
