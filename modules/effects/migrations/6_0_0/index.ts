import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '@ngrx/effects/schematics-core';

export default function (): Rule {
  return updatePackage('effects');
}
