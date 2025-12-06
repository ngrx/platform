import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import versionInfoData from '../data/versionInfo.json';

export interface NavigationNode {
  url: string;
  title: string;
}

export interface VersionInfo {
  currentVersion: string;
  docVersions: NavigationNode[];
}

@Injectable({ providedIn: 'root' })
export class VersionInfoService {
  private readonly versionInfo = versionInfoData as VersionInfo;

  getVersions() {
    return of(this.versionInfo.docVersions);
  }

  getCurrentVersion(): string {
    return this.versionInfo.currentVersion;
  }
}
