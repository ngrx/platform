import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Hero, ModalComponent } from '../../core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'ngrx-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroListComponent {
  @Input() heroes: Hero[];
  @Input() selectedHero: Hero;
  @Output() deleted = new EventEmitter<Hero>();
  @Output() selected = new EventEmitter<Hero>();

  constructor(public dialog: MatDialog) {}

  byId(index: number, hero: Hero) {
    return hero.id;
  }

  select(hero: Hero) {
    this.selected.emit(hero);
  }

  deleteHero(hero: Hero) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '250px';
    dialogConfig.data = {
      title: 'Delete Hero',
      message: `Do you want to delete ${hero.name}`,
    };

    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((deleteIt) => {
      console.log('The dialog was closed');
      if (deleteIt) {
        this.deleted.emit(hero);
      }
    });
  }
}
