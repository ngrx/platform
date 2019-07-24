import {
  ɵComponentDef as ComponentDef,
  ɵNG_COMPONENT_DEF as NG_COMPONENT_DEF,
  Type,
} from '@angular/core';
import {
  getPropertySubject,
  getReplaySubjectFactory,
} from '../core/get-property-subject';
import { EMPTY, Observable, of, pipe, UnaryFunction } from 'rxjs';
import { catchError, take, takeUntil } from 'rxjs/operators';

export enum HookNames {
  afterContentChecked = 'afterContentChecked',
  afterContentInit = 'afterContentInit',
  afterViewChecked = 'afterViewChecked',
  afterViewInit = 'afterViewInit',
  doCheck = 'doCheck',
  onChanges = 'onChanges',
  onDestroy = 'onDestroy',
  onInit = 'onInit',
}

interface Hooks {
  afterContentChecked: string;
  afterContentInit: string;
  afterViewChecked: string;
  afterViewInit: string;
  doCheck: string;
  onChanges: string;
  onDestroy: string;
  onInit: string;
}

const hooksWrapped: { [x in keyof Hooks]: boolean } = {
  afterContentChecked: false,
  afterContentInit: false,
  afterViewChecked: false,
  afterViewInit: false,
  doCheck: false,
  onChanges: true,
  onDestroy: false,
  onInit: false,
};

const singleShotOperators = (
  destroy$: Observable<any>
): UnaryFunction<any, any> =>
  pipe(
    take(1),
    catchError(e => of()),
    takeUntil(destroy$)
  );
const onGoingOperators = (destroy$: Observable<any>): UnaryFunction<any, any> =>
  pipe(
    catchError(e => EMPTY),
    takeUntil(destroy$)
  );

const getHooksOperatorsMap = (
  destroy$: Observable<any>
): { [x in keyof Hooks]: UnaryFunction<any, any> } => ({
  afterContentChecked: singleShotOperators(destroy$),
  afterContentInit: singleShotOperators(destroy$),
  afterViewChecked: onGoingOperators(destroy$),
  afterViewInit: singleShotOperators(destroy$),
  doCheck: onGoingOperators(destroy$),
  onChanges: onGoingOperators(destroy$),
  onDestroy: pipe(
    catchError(e => of()),
    take(1)
  ),
  onInit: singleShotOperators(destroy$),
});

export function Hook$<T>(hookName: keyof Hooks): PropertyDecorator {
  return (
    // tslint:disable-next-line
    component: Object,
    propertyKey: PropertyKey
  ) => {
    const keyUniquePerPrototype = Symbol('@ngrx-hook$');
    const subjectFactory = getReplaySubjectFactory(1);

    const cDef: ComponentDef<any> = (component as any).constructor[
      NG_COMPONENT_DEF
    ];

    let target: any;
    let hook;
    let originalHook: any;

    if (cDef === undefined) {
      target = component;
      hook = getCompHookName(hookName);
      originalHook = target[hook];
    } else {
      // @TODO I guess this is a miss conception that ngChanges is wrapped in a function.
      target = hooksWrapped[hookName] ? component : cDef;
      hook = hooksWrapped[hookName] ? getCompHookName(hookName) : hookName;
      originalHook = hooksWrapped[hookName]
        ? (cDef as any)[hook]
        : (component as any)[hook];
    }

    target[hook] = function(args: any) {
      getPropertySubject<T>(
        this,
        keyUniquePerPrototype,
        subjectFactory,
        hookName
      ).next(args);
      // tslint:disable-next-line:no-unused-expression
      originalHook && originalHook.call(component, args);
    };

    const propertyKeyDescriptor: TypedPropertyDescriptor<Observable<T>> = {
      get() {
        const destroy$ = getPropertySubject<T>(
          this,
          keyUniquePerPrototype,
          subjectFactory,
          HookNames.onDestroy
        ).asObservable();
        const hookOperators = getHooksOperatorsMap(destroy$)[hookName];
        return getPropertySubject<T>(
          this,
          keyUniquePerPrototype,
          subjectFactory,
          hookName
        )
          .asObservable()
          .pipe(hookOperators);
      },
    };
    Object.defineProperty(target, propertyKey, propertyKeyDescriptor);
  };
}

function getCompHookName(hookName: string): string {
  return 'ng' + hookName[0].toUpperCase() + hookName.slice(1);
}
