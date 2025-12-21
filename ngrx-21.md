---
title: Announcing NgRx 21: Celebrating a 10 Year Journey with a fresh new look and @ngrx/signals/events
published: false
description: Announcing NgRx 21: Celebrating a 10 Year Journey with a fresh new look and @ngrx/signals/events
tags: ngrx, angular
cover_image: https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5ed55ozu4pbd3bdvftru.jpg
# Use a ratio of 100:42 for best results.
---

We are pleased to announce the latest major version of the NgRx framework with some exciting new features, bug fixes, and other updates.

## 10 Year Anniversary 🎉

Ten years ago, NgRx started as a small experiment created by Rob Wormald, Mike Ryan, and Brandon Roberts to bring Redux-style state management to Angular applications. Since then, Angular has changed a lot, our tooling has changed a lot, and the way we build applications has changed a lot – but NgRx is still the go-to solution many of us reach for managing state in Angulars.

Over the years, NgRx has grown from `@ngrx/store` into a full platform: router integration, entity helpers, devtools, component utilities, ESLint rules, and most recently Signals.

Huge thanks to Alex Okrushko, Brandon Roberts, Marko Stanimirović, Mike Ryan, Rainer Hahnekamp, Tim Deschryver, everyone who has been on the [team](https://ngrx.io/about) along the way, and the many contributors. Equally important are the countless content creators who helped the rest of us learn how to use these tools well.

If you have used NgRx in the last decade, you’re part of that story. Thank you. 🙏

Some key-numbers to highlight teams are confident that NgRx helps to build quality production-ready applications throughout these years:

- 483 contributors
- 2.250 commits
- 2.400 issues closed
- `@ngrx/store` has been downloaded 174.070.253 times
- `@ngrx/signals` has been downloaded 14.665.960 times

## New Website 🎨

To celebrate this milestone we’re shipping a refreshed website at https://ngrx.io.

The new site is build with [Analog](https://analogjs.org) and has a modernized look and feel, improved navigation, and better performance. We're also looking to update the docs and examples to make it easier to find what you need, whether you're just getting started or looking for advanced patterns.

Huge shout-out to Mike Ryan for the new design and setup, and to Brandon Roberts, Duško Perić, and Tim Deschryver for the content migration and improvements.

## Welcome Rainer 🏆

We are thrilled to welcome Rainer to the NgRx core team! Rainer has been an active member of the NgRx community for years, from giving talks and workshops at conferences and meet-ups, to contributing code, documentation, and support to fellow developers. His expertise and passion for Angular and NgRx make him a valuable addition to our team. Please join us in welcoming Rainer to the NgRx family!

## The Events Plugin is stable 🚀

In NgRx 19 we introduced `@ngrx/signals/events` as an experimental way to model event-driven workflows in your Angular applications using Signals and Signal Stores.

Thanks to your feedback the APIs have been cleaned up and the rough edges have been sanded down. This makes us confident to promote the Events plugin to stable in this release.

If you want to explore how to use Events plugin in your app, check out the [Events documentation](https://ngrx.io/guide/signals/signal-store/events).

### Addition of Scoped Events

The most important addition is support for **scoped events**. Instead of broadcasting every event globally, you can scope events to a specific part of your app – the local scope, parent scope, or the global scope. Typical examples include local state management scenarios where events should stay within a specific feature, or micro-frontend architectures where each remote module needs its own isolated event scope.

```ts
import { provideDispatcher } from '@ngrx/signals/events';

@Component({
  providers: [
    // 👇 Provide local `Dispatcher` and `Events` services
    // at the `BookSearch` injector level.
    provideDispatcher(),
    BookSearchStore,
  ],
})
export class BookSearch {
  readonly store = inject(BookSearchStore);
  readonly dispatch = injectDispatch(bookSearchEvents);

  constructor() {
    // 👇 Dispatch event to the local scope.
    this.dispatch.opened();
  }

  changeQuery(query: string): void {
    // 👇 Dispatch event to the parent scope.
    this.dispatch({ scope: 'parent' }).queryChanged(query);
  }

  triggerRefresh(): void {
    // 👇 Dispatch event to the global scope.
    this.dispatch({ scope: 'global' }).refreshTriggered();
  }
}
```

To learn more about scoped events, check out the [scoped events documentation](https://ngrx.io/guide/signals/signal-store/events#scoped-events).

## Updating to NgRx v21

To start using NgRx 21, make sure to have the following minimum versions installed:

- Angular version 21.x
- Angular CLI version 21.x
- TypeScript version 5.9.x
- RxJS version ^6.5.x or ^7.5.x

NgRx supports using the Angular CLI ng update command to update your NgRx packages. To update your packages to the latest version, run the command:

```bash
ng update @ngrx/store@21
ng update @ngrx/signals@21
```

---

## A Big Thank You to Our Community! ❤️

NgRx is a community-driven project, and we are immensely grateful for everyone who contributes their time and expertise. Your bug reports, feature requests, documentation improvements, and pull requests are what make this project thrive.

We want to give a special shout-out to a few individuals for their direct contributions to this release:

- Dima Vasylyna for implementing the prependEntity feature.
- Murat Sari for the new ESLint rule to enforce type invocation.

We also want to extend a huge thank you to our sponsors. Your financial support is crucial for the continued development and maintenance of NgRx.
A special thanks to our Gold sponsor, Nx, and our Bronze sponsor, House of Angular.

---

## A Big Thank You to Our Community! ❤️

NgRx is a community-driven project, and we are immensely grateful for everyone who contributes their time and expertise. Your bug reports, feature requests, documentation improvements, and pull requests are what make this project thrive.

We want to give a special shout-out to a few individuals for their direct contributions to this release:

- [Exequiel Ceasar Navarrete](https://github.com/exequiel09) for migrating the test suite to Vitest.
- [J. Degand](https://github.com/jdegand) for quality of life improvements.

We also want to extend a huge thank you to our sponsors. Your financial support is crucial for the continued development and maintenance of NgRx.
A special thanks to our Gold sponsor, Nx, and our Bronze sponsor, House of Angular.

## Sponsor NgRx 🤝

If you are interested in sponsoring the continued development of NgRx, please visit our GitHub Sponsors page for different sponsorship options, or contact us directly to discuss other sponsorship opportunities.

Follow us on X / Twitter and LinkedIn for the latest updates about the NgRx platform.

## What's Next?

We are incredibly excited about what you will build with NgRx v21. We encourage you to try out the new features and share your feedback with us. We are especially interested in hearing your thoughts on the new experimental Events plugin. Please open issues and discussions on our GitHub repository to let us know what you think.

To stay up-to-date with the latest news, follow us on Twitter and LinkedIn.

Thank you for being part of the NgRx community! Happy coding!
