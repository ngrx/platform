import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent, Villain } from '../../core';

@Component({
  selector: 'ngrx-villain-list',
  templateUrl: './villain-list.component.html',
  styleUrls: ['./villain-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VillainListComponent {
  @Input() villains: Villain[];
  @Input() selectedVillain: Villain;
  @Output() deleted = new EventEmitter<Villain>();
  @Output() selected = new EventEmitter<Villain>();

  constructor(public dialog: MatDialog) {}

  byId(index: number, villain: Villain) {
    return villain.id;
  }

  select(villain: Villain) {
    this.selected.emit(villain);
  }

  deleteVillain(villain: Villain) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '250px';
    dialogConfig.data = {
      title: 'Delete Villain',
      message: `Do you want to delete ${villain.name}`,
    };

    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((deleteIt) => {
      console.log('The dialog was closed');
      if (deleteIt) {
        this.deleted.emit(villain);
      }
    });
  }
}
