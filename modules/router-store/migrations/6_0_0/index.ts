import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '@ngrx/router-store/schematics-core';

export default function (): Rule {
  return updatePackage('router-store');
}
