# Common patterns

## Performing tasks based on dispatched actions within a component

There is a common use case of wanting to perform some task inside a component based on actions that have been dispatched
outside the component, normally with Effects.

Use the `Effects` APIs to listen to dispatched actions:

<code-example header="active.component.ts">
import { Actions, ofType } from '@ngrx/effects';

@Component({ ... })
export class ActiveComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject();

  constructor(private readonly actions$: Actions) {}
  
  ngOnInit() {
    this.actions$.pipe(
      ofType(someSuccessAction),
      takeUntil(this.destroy$),
      tap(() => {
        this.doSomethingLocally();
      })
    ).subscribe();
  }
  
  ngOnDestroy() {
    this.destroy$.next();
  }
  
  private doSomethingLocally() {}
}
</code-example>

## Performing tasks based on state changes within a component

Without using the `@ngrx/effects` package, we can listen to a given piece of state and react to the changes:

<code-tabs linenums="true">

  <code-pane
  header="active.component.ts">
  import { Store } from '@ngrx/store';
  
  @Component({ ... })
  export class ActiveComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    
    constructor(private readonly store: Store) {}
    
    ngOnInit() {
      this.store
      .select(selectDoneFromStateSlice)
      .pipe(
        filter(done => Boolean(done)),
        takeUntil(this.destroy$),
        tap(() => {
          this.doSomethingLocally();
        })
      ).subscribe();
    }
    
    ngOnDestroy() {
      this.destroy$.next();
    }
    
    private doSomethingLocally() {}
  }
  </code-pane>

  <code-pane
  header="confirmation-dialog.component.ts">
  import { Store } from '@ngrx/store';
  
  @Component({ ... })
  export class ConfirmDialogComponent implements OnInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();
    
    constructor(private readonly store: Store, private readonly dialogRef: DialogRef<string>) {}
    
    ngOnInit() {
      this.closeDialogOnSuccessfulDeletion();
    }
    
    ngOnDestroy() {
      this.destroy$.next();
    }
    
    private closeDialogOnSuccessfulDeletion() {
      this.store
        .select(isDeletionInProgress)
        .pipe(
          pairwise(),
          filter(([isPreviouslyLoading, isLoading]: [boolean, boolean]) => isPreviouslyLoading && !isLoading),
          takeUntil(this.destroy$)
        )
        .subscribe((): void => {
          dialogRef.close('deleted');
        })
    }
  }
  </code-pane>

</code-tabs>
