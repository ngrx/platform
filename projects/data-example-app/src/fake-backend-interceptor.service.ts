import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Story } from './state/story';

const data: Record<string, Story> = {};

@Injectable({
  providedIn: 'root',
})
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, body } = req;

    let storyId: string | undefined;

    if (req.method === 'GET' && req.url.includes('stories')) {
      return of(new HttpResponse({ status: 200, body: Object.values(data) }));
    }

    switch (req.method) {
      case 'GET':
        storyId = url.split('/').pop();

        if (!storyId) {
          return throwError(() => new HttpErrorResponse({ status: 400 }));
        }

        const obj = data[storyId];
        if (obj) {
          return of(new HttpResponse({ status: 200, body: obj }));
        }

        return throwError(() => new HttpErrorResponse({ status: 404 }));

      case 'POST':
        storyId = Date.now().toString();
        data[storyId] = {
          ...body,
          storyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return of(new HttpResponse({ status: 201, body: data[storyId] }));

      case 'PUT':
        storyId = url.split('/').pop();

        if (!storyId) {
          return throwError(() => new HttpErrorResponse({ status: 400 }));
        }

        if (!data[storyId]) {
          return throwError(() => new HttpErrorResponse({ status: 404 }));
        }

        data[storyId] = {
          ...data[storyId],
          ...body,
          updatedAt: new Date(),
        };

        return of(new HttpResponse({ status: 200, body: data[storyId] }));

      case 'DELETE':
        storyId = url.split('/').pop();

        if (!storyId) {
          return throwError(() => new HttpErrorResponse({ status: 400 }));
        }

        delete data[storyId];

        return of(new HttpResponse({ status: 200, body: storyId }));

      default:
        return throwError(() => new HttpErrorResponse({ status: 501 }));
    }
  }
}
