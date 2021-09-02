import { Component } from '@angular/core';

@Component({
  selector: 'ngrx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  labTitle = 'ngrx/data-lab';
  labState = 'now using ngrx/data';
}
