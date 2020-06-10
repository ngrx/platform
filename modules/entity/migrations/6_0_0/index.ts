import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '@ngrx/entity/schematics-core';

export default function (): Rule {
  return updatePackage('entity');
}
