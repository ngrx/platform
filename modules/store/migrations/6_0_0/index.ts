import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '@ngrx/store/schematics-core';

export default function (): Rule {
  return updatePackage('store');
}
