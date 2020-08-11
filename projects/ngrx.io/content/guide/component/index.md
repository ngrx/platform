# @ngrx/component

Component is a set of primitive reactive helpers to enable fully reactive, Zoneless applications. They give more control over rendering, and provide further reactivity for Angular applications.

<div class="alert is-critical">

This package is still experimental and may change during development.

</div>

## Key Concepts

Rendering happens in the template only:
  - The [ngrxPush pipe](guide/component/push) provides a drop-in replacement for the `async` pipe.
  - The [ngrxLet directive](guide/component/let) provides a structural directive with better support for handling observables. 

## Installation

Detailed installation instructions can be found on the [Installation](guide/component/install) page.

## Usage

Both the `*ngrxLet` directive, and `ngrxPush` pipe are provided through the `ReactiveComponentModule`. To use them, add the `ReactiveComponentModule` to the `imports` of your NgModule.

```typescript
import { NgModule } from '@angular/core';
import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  imports: [
    // other imports
    ReactiveComponentModule
  ]
})
export class MyFeatureModule {}
```

Read more about the [ngrxLet directive](guide/component/let), and [ngrxPush pipe](guide/component/push).
