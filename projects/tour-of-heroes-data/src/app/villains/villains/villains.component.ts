import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Villain } from '../../core';
import { VillainService } from '../villain.service';

@Component({
  selector: 'ngrx-villains',
  templateUrl: './villains.component.html',
  styleUrls: ['./villains.component.scss'],
})
export class VillainsComponent implements OnInit {
  selected: Villain;
  villains: Villain[];
  loading: boolean;

  constructor(private villainService: VillainService) {}

  ngOnInit() {
    this.getVillains();
  }

  add(villain: Villain) {
    this.loading = true;
    this.villainService
      .add(villain)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (addedvillain) => (this.villains = this.villains.concat(addedvillain))
      );
  }

  close() {
    this.selected = null;
  }

  delete(villain: Villain) {
    this.loading = true;
    this.close();
    this.villainService
      .delete(villain)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => (this.villains = this.villains.filter((h) => h.id !== villain.id))
      );
  }

  enableAddMode() {
    this.selected = null;
  }

  getVillains() {
    this.loading = true;
    this.villainService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((villains) => (this.villains = villains));
    this.close();
  }

  select(villain: Villain) {
    this.selected = <any>{};
  }

  update(villain: Villain) {
    this.loading = true;
    this.villainService
      .update(villain)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () =>
          (this.villains = this.villains.map((h) =>
            h.id === villain.id ? villain : h
          ))
      );
  }
}
