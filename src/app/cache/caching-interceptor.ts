import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpInterceptor,
  HttpHandler,
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestCacheService } from './request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private requestCache: RequestCacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cacheable and localStorage is unavailable.
    if (!this.isLocalStorageAvailable() || !this.isCacheable(req)) {
      return next.handle(req);
    }
    const cachedResponse = this.requestCache.get(req);
    if (cachedResponse) {
      return of(cachedResponse);
    } else {
      return this.sendRequest(req, next, this.requestCache);
    }
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCacheService
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }

  private isCacheable(req: HttpRequest<any>): boolean {
    return req.method === 'GET' && req.headers.has('cache');
  }

  private isLocalStorageAvailable() {
    var test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
