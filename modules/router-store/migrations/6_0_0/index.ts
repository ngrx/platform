import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '../../schematics-core';

export default function (): Rule {
  return updatePackage('router-store');
}
