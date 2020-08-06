# @ngrx/component-store

ComponentStore is a stand-alone library that helps to manage local/component state. It's an alternative to reactive push-based "Service with a Subject" approach.

## Key Concepts

- Local state has to be initialized, but it can be done lazily.
- Local state is typically tied to the life-cycle of a particular component and is cleaned up when that component is destroyed.
- Users of ComponentStore can update the state through `setState` or `updater`, either imperatively or by providing an Observable.
- Users of ComponentStore can read the state through `select` or a top-level `state$`. Selectors are very performant.
- Users of ComponentStore may start side-effects with `effect`, both sync and async, and feed the data both imperatively or reactively.

The details about [initialization](guide/component-store/initialization), [writing](guide/component-store/write) and [reading](guide/component-store/read) from state, 
and [side-effects](guide/component-store/effect) management can be found in the corresponding sections of the Architecture.

## Installation

Detailed installation instructions can be found on the [Installation](guide/component-store/install) page.

## @ngrx/store or @ngrx/component-store?

The Global Store and Component Store are designed to solve different problems and can be used independently from each other. The detailed comparison can
be found at [Store vs ComponentStore](guide/component-store/comparison) section.
