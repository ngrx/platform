import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero, ToastService } from '../core';
// import { HeroesModule } from './heroes.module';

const api = '/api';

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  logout() {
    return this.http.get(`${api}/logout`);
  }

  getProfile() {
    return this.http.get<any>(`${api}/profile`);
  }

  getAll() {
    const url = `${api}/heroes`;
    const msg = 'Heroes retrieved successfully!';
    return this.http.get<Hero[]>(url).pipe(
      tap(() => this.toastService.openSnackBar(msg, 'GET')),
      catchError(this.handleError)
    );
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return observableThrowError(res.error || 'Server error');
  }

  delete(hero: Hero) {
    return this.http
      .delete(`${api}/hero/${hero.id}`)
      .pipe(
        tap(() =>
          this.toastService.openSnackBar(`Hero ${hero.name} deleted`, 'DELETE')
        )
      );
  }

  add(hero: Hero) {
    return this.http
      .post<Hero>(`${api}/hero/`, hero)
      .pipe(
        tap(() =>
          this.toastService.openSnackBar(`Hero ${hero.name} added`, 'POST')
        )
      );
  }

  update(hero: Hero) {
    return this.http
      .put<Hero>(`${api}/hero/${hero.id}`, hero)
      .pipe(
        tap(() =>
          this.toastService.openSnackBar(`Hero ${hero.name} updated`, 'PUT')
        )
      );
  }
}
