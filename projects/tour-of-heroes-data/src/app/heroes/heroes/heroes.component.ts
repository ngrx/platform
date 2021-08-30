import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Hero } from '../../core';
import { HeroService } from '../hero.service';

@Component({
  selector: 'ngrx-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  selected: Hero;
  heroes: Hero[];
  loading: boolean;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getHeroes();
  }

  add(hero: Hero) {
    this.loading = true;
    this.heroService
      .add(hero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((addedHero) => (this.heroes = this.heroes.concat(addedHero)));
  }

  close() {
    this.selected = null;
  }

  delete(hero: Hero) {
    this.loading = true;
    this.close();
    this.heroService
      .delete(hero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => (this.heroes = this.heroes.filter((h) => h.id !== hero.id))
      );
  }

  enableAddMode() {
    this.selected = <any>{};
  }

  getHeroes() {
    this.loading = true;
    this.heroService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((heroes) => (this.heroes = heroes));
    this.close();
  }

  select(hero: Hero) {
    this.selected = hero;
  }

  update(hero: Hero) {
    this.loading = true;
    this.heroService
      .update(hero)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () =>
          (this.heroes = this.heroes.map((h) => (h.id === hero.id ? hero : h)))
      );
  }
}
