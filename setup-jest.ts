import 'jest-preset-angular';
import { MdCommonModule } from '@angular/material';

global['CSS'] = null;
MdCommonModule.prototype['_checkDoctype'] = function() {};
MdCommonModule.prototype['_checkTheme'] = function() {};
