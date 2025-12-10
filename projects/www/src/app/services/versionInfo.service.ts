import { Injectable } from '@angular/core';
import versionInfoData from '../data/versionInfo.json';

interface PreviousVersion {
  url: string;
  title: string;
}

interface VersionInfo {
  currentVersion: string;
  docVersions: PreviousVersion[];
}

@Injectable({ providedIn: 'root' })
export class VersionInfoService {
  readonly #versionInfo = versionInfoData as VersionInfo;
  readonly currentVersion = this.#versionInfo.currentVersion;
  readonly previousVersions = this.#versionInfo.docVersions;
}
