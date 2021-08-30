import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ToastService, Villain } from '../core';

const api = '/api';

@Injectable({ providedIn: 'root' })
export class VillainService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  logout() {
    return this.http.get(`${api}/logout`);
  }

  getProfile() {
    return this.http.get<any>(`${api}/profile`);
  }

  getVillain(id: number) {
    return this.http.get<Array<Villain>>(`${api}/villains/${id}`).pipe(
      map((villain) => villain),
      tap(() =>
        this.toastService.openSnackBar('Villain retrieved successfully!', 'GET')
      ),
      catchError(this.handleError)
    );
  }

  getAll() {
    return this.http.get<Array<Villain>>(`${api}/villains`).pipe(
      map((villains) => villains),
      tap(() =>
        this.toastService.openSnackBar(
          'Villains retrieved successfully!',
          'GET'
        )
      ),
      catchError(this.handleError)
    );
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return observableThrowError(res.error || 'Server error');
  }

  delete(villain: Villain) {
    return this.http
      .delete(`${api}/villain/${villain.id}`)
      .pipe(
        tap(() =>
          this.toastService.openSnackBar(
            `Villain ${villain.name} deleted`,
            'DELETE'
          )
        )
      );
  }

  add(villain: Villain) {
    return this.http
      .post<Villain>(`${api}/villain/`, villain)
      .pipe(
        tap(() =>
          this.toastService.openSnackBar(
            `Villain ${villain.name} added`,
            'POST'
          )
        )
      );
  }

  update(villain: Villain) {
    return this.http
      .put<Villain>(`${api}/villain/${villain.id}`, villain)
      .pipe(
        tap(() =>
          this.toastService.openSnackBar(
            `Villain ${villain.name} updated`,
            'PUT'
          )
        )
      );
  }
}
