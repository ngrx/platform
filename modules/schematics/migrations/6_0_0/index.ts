import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '@ngrx/schematics/schematics-core';

export default function (): Rule {
  return updatePackage('schematics');
}
