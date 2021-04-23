// Pulled all interfaces out of `navigation.service.ts` because of this:
// https://github.com/angular/angular-cli/issues/2034
// Then re-export them from `navigation.service.ts`

export interface NavigationNode {
    url?: string;
    title?: string;
    tooltip?: string;
    hidden?: boolean;
    children?: NavigationNode[];
}

export type NavigationResponse = {__versionInfo: VersionInfo } & { [name: string]: NavigationNode[]|VersionInfo };

export interface NavigationViews {
    [name: string]: NavigationNode[];
}

/**
 *  Navigation information about a node at specific URL
 *  url: the current URL
 *  view: 'SideNav' | 'TopBar' | 'Footer' | etc
 *  nodes: the current node and its ancestor nodes within that view
 */
export interface CurrentNode {
    url: string;
    view: string;
    nodes: NavigationNode[];
}

/**
 * A map of current nodes by view.
 * This is needed because some urls map to nodes in more than one view.
 * If a view does not contain a node that matches the current url then the value will be undefined.
 */
export interface CurrentNodes {
    [view: string]: CurrentNode;
}

export interface VersionInfo {
    raw: string;
    major: number;
    minor: number;
    patch: number;
    prerelease: string[];
    build: string;
    version: string;
    codeName: string;
    isSnapshot: boolean;
    full: string;
    branch: string;
    commitSHA: string;
}
