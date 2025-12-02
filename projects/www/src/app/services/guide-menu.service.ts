import { Injectable } from '@angular/core';

export type Link = { kind: 'link'; url: string; text: string };
export type Section = {
  kind: 'section';
  title: string;
  children: (Link | Section | LineBreak)[];
};
export type LineBreak = { kind: 'break' };
export type FlattenedLink = { url: string; text: string; parents: string[] };

export const link = (text: string, url: string): Link => ({
  kind: 'link',
  url,
  text,
});
export const section = (
  title: string,
  children: (Link | Section | LineBreak)[]
): Section => ({
  kind: 'section',
  title,
  children,
});
export const lineBreak = (): LineBreak => ({ kind: 'break' });

const MORE_PACKAGES = 'More Packages';

@Injectable({ providedIn: 'root' })
export class GuideMenuService {
  private readonly links = section('NgRx Guide', [
    section('Store', [
      link('Why use Store?', '/guide/store/why'),
      link('Getting Started', '/guide/store'),
      link('Walkthrough', '/guide/store/walkthrough'),
      link('Installation', '/guide/store/install'),
      section('Architecture', [
        link('Actions', '/guide/store/actions'),
        link('Reducers', '/guide/store/reducers'),
        link('Selectors', '/guide/store/selectors'),
      ]),
      section('Advanced', [
        link('Meta-Reducers', '/guide/store/metareducers'),
        link('Feature Creators', '/guide/store/feature-creators'),
        link('Action Groups', '/guide/store/action-groups'),
      ]),
      section('Recipes', [
        link('Injecting Reducers', '/guide/store/recipes/injecting'),
        link('Downgrade for AngularJS', '/guide/store/recipes/downgrade'),
      ]),
      section('Devtools', [
        link('Overview', '/guide/store-devtools'),
        link('Installation', '/guide/store-devtools/install'),
        link('Configuration', '/guide/store-devtools/config'),
        section('Recipes', [
          link(
            'Exclude from Production',
            '/guide/store-devtools/recipes/exclude'
          ),
        ]),
      ]),
      link('Runtime Checks', '/guide/store/configuration/runtime-checks'),
      link('Testing', '/guide/store/testing'),
    ]),
    section('Effects', [
      link('Overview', '/guide/effects'),
      link('Installation', '/guide/effects/install'),
      link('Testing', '/guide/effects/testing'),
      link('Lifecycle', '/guide/effects/lifecycle'),
      link('Operators', '/guide/effects/operators'),
    ]),
    section('Signals', [
      link('Overview', '/guide/signals'),
      link('Installation', '/guide/signals/install'),
      section('SignalStore', [
        link('Core Concepts', '/guide/signals/signal-store'),
        link('Lifecycle Hooks', '/guide/signals/signal-store/lifecycle-hooks'),
        link(
          'Custom Store Properties',
          '/guide/signals/signal-store/custom-store-properties'
        ),
        link('Linked State', '/guide/signals/signal-store/linked-state'),
        link('State Tracking', '/guide/signals/signal-store/state-tracking'),
        link(
          'Private Store Members',
          '/guide/signals/signal-store/private-store-members'
        ),
        link(
          'Custom Store Features',
          '/guide/signals/signal-store/custom-store-features'
        ),
        link(
          'Entity Management',
          '/guide/signals/signal-store/entity-management'
        ),
        link('Events', '/guide/signals/signal-store/events'),
        link('Testing', '/guide/signals/signal-store/testing'),
      ]),
      link('SignalState', '/guide/signals/signal-state'),
      link('DeepComputed', '/guide/signals/deep-computed'),
      link('SignalMethod', '/guide/signals/signal-method'),
      link('RxJS Integration', '/guide/signals/rxjs-integration'),
      link('FAQ', '/guide/signals/faq'),
    ]),
    section('Entity', [
      link('Overview', '/guide/entity'),
      link('Installation', '/guide/entity/install'),
      link('Entity Interfaces', '/guide/entity/interfaces'),
      link('Entity Adapter', '/guide/entity/adapter'),
      section('Recipes', [
        link(
          'Additional State Properties',
          '/guide/entity/recipes/additional-state-properties'
        ),
        link(
          'Entity Adapter with Feature Creator',
          '/guide/entity/recipes/entity-adapter-with-feature-creator'
        ),
      ]),
    ]),
    section('Router Store', [
      link('Overview', '/guide/router-store'),
      link('Installation', '/guide/router-store/install'),
      link('Actions', '/guide/router-store/actions'),
      link('Selectors', '/guide/router-store/selectors'),
      link('Configuration', '/guide/router-store/configuration'),
    ]),
    section('Operators', [
      link('Overview', '/guide/operators'),
      link('Installation', '/guide/operators/install'),
      link('Operators', '/guide/operators/operators'),
    ]),
    section(MORE_PACKAGES, [
      section('Component Store', [
        link('Overview', '/guide/component-store'),
        link('Installation', '/guide/component-store/install'),
        section('Architecture', [
          link('Initialization', '/guide/component-store/initialization'),
          link('Read', '/guide/component-store/read'),
          link('Write', '/guide/component-store/write'),
          link('Effects', '/guide/component-store/effect'),
        ]),
        link('Lifecycle', '/guide/component-store/lifecycle'),
        link('ComponentStore vs Store', '/guide/component-store/comparison'),
        link('Usage', '/guide/component-store/usage'),
      ]),
      section('Component', [
        link('Overview', '/guide/component'),
        link('Installation', '/guide/component/install'),
        link('Let Directive', '/guide/component/let'),
        link('Push Pipe', '/guide/component/push'),
      ]),
      section('Data', [
        link('Overview', '/guide/data'),
        link('Installation', '/guide/data/install'),
        section('Architecture', [
          link('Overview', '/guide/data/architecture-overview'),
          link('Entity Metadata', '/guide/data/entity-metadata'),
          link('Entity Actions', '/guide/data/entity-actions'),
          link('Entity Collection', '/guide/data/entity-collection'),
          link(
            'Entity Collection Service',
            '/guide/data/entity-collection-service'
          ),
          link('Entity Dataservice', '/guide/data/entity-dataservice'),
          link('Entity Effects', '/guide/data/entity-effects'),
          link('Entity Reducer', '/guide/data/entity-reducer'),
          link('Entity Services', '/guide/data/entity-services'),
        ]),
        section('Advanced', [
          link('Save Multiple Entities', '/guide/data/save-entities'),
          link('Entity Change Tracking', '/guide/data/entity-change-tracker'),
          link('Extension Points', '/guide/data/extension-points'),
        ]),
        link('FAQ', '/guide/data/faq'),
        link('Limitations', '/guide/data/limitations'),
      ]),
    ]),
    lineBreak(),
    section('Schematics', [
      link('Overview', '/guide/schematics'),
      link('Installation', '/guide/schematics/install'),
      section('Collection', [
        link('Store', '/guide/schematics/store'),
        link('Action', '/guide/schematics/action'),
        link('Reducer', '/guide/schematics/reducer'),
        link('Selector', '/guide/schematics/selector'),
        link('Container', '/guide/schematics/container'),
        link('Effect', '/guide/schematics/effect'),
        link('Entity', '/guide/schematics/entity'),
        link('Feature', '/guide/schematics/feature'),
      ]),
    ]),
    section('ESLint Plugin', [
      link('Overview', '/guide/eslint-plugin'),
      link('Installation', '/guide/eslint-plugin/install'),
    ]),
    lineBreak(),
    section('Developer Resources', [
      link('Nightlies', '/guide/nightlies'),
      section('Migrations', [
        link('V21', '/guide/migration/v21'),
        link('V20', '/guide/migration/v20'),
        link('V19', '/guide/migration/v19'),
        link('V18', '/guide/migration/v18'),
        link('V17', '/guide/migration/v17'),
        link('V16', '/guide/migration/v16'),
        link('V15', '/guide/migration/v15'),
        link('V14', '/guide/migration/v14'),
        link('V13', '/guide/migration/v13'),
        link('V12', '/guide/migration/v12'),
        link('V11', '/guide/migration/v11'),
        link('V10', '/guide/migration/v10'),
        link('V9', '/guide/migration/v9'),
        link('V8', '/guide/migration/v8'),
        link('V7', '/guide/migration/v7'),
        link('V4', '/guide/migration/v4'),
      ]),
    ]),
  ]);

  private readonly flattenedLinks = this.links.children.flatMap((section) =>
    section.kind === 'section' ? this.flattenLinks(section) : []
  );

  private flattenLinks(
    section: Section,
    parents: string[] = [section.title]
  ): FlattenedLink[] {
    const links: FlattenedLink[] = [];

    for (const child of section.children) {
      if (child.kind === 'link') {
        links.push({
          url: child.url,
          text: child.text,
          parents: parents.filter((parent) => parent !== MORE_PACKAGES),
        });
      } else if (child.kind === 'section') {
        links.push(...this.flattenLinks(child, [...parents, child.title]));
      }
    }

    return links;
  }

  getMenu(): Section {
    return this.links;
  }

  getNextLink(url: string): FlattenedLink | null {
    const index = this.flattenedLinks.findIndex((link) => link.url === url);

    if (index === -1) {
      return null;
    }

    return this.flattenedLinks[index + 1] ?? null;
  }

  getPreviousLink(url: string): FlattenedLink | null {
    const index = this.flattenedLinks.findIndex((link) => link.url === url);

    if (index === -1) {
      return null;
    }

    return this.flattenedLinks[index - 1] ?? null;
  }
}
