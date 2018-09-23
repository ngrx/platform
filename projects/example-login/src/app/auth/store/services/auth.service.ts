import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { UserCredentials } from '../model/user.credential';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: Http) {}

  login(userCredentials: any): Observable<any> {
    console.log(userCredentials);
    if (userCredentials.account !== 'test') {
      return throwError('Invalid username or password');
    }
    return of({ name: 'User' });
  }
}
