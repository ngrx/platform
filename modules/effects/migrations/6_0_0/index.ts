import { Rule } from '@angular-devkit/schematics';
import { updatePackage } from '../../src/schematics-core';

export default function(): Rule {
  return updatePackage('effects');
}
