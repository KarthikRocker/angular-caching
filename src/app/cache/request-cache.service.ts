import { Inject, Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import {
  ICacheEntry,
  ICacheOptions,
  IRequestCacheEntry,
} from './cache-storage/cache-storage.interface';
import { CacheStorageService } from './cache-storage/cache-storage.service';
import { AppConfig, APP_CONFIG } from '../app-config';

@Injectable({
  providedIn: 'root',
})
export class RequestCacheService {
  private readonly maxAge: number;
  private readonly prefix = 'RequestCache_';
  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private cacheStorageService: CacheStorageService
  ) {
    this.maxAge = appConfig?.CachingExpirationTime ?? 0;
  }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    let cacheOption: ICacheOptions = { key: undefined, maxAge: undefined };
    if (req.headers.get('cache')) {
      cacheOption = JSON.parse(
        req.headers.get('cache') as string
      ) as ICacheOptions;
    }
    const key = `${this.prefix}${cacheOption.key ?? req.urlWithParams}`;
    const cached = this.cacheStorageService.get(key);

    if (!cached) {
      return undefined;
    }

    const isExpired =
      this.maxAge != 0 &&
      cached.lastRead < Date.now() - (cached.maxAge ?? this.maxAge);
    return isExpired ? undefined : this.getResponse(cached);
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    let cacheOption: ICacheOptions = { key: undefined, maxAge: undefined };
    if (req.headers.get('cache')) {
      cacheOption = JSON.parse(
        req.headers.get('cache') as string
      ) as ICacheOptions;
    }
    const key = `${this.prefix}${cacheOption.key ?? req.urlWithParams}`;
    const entry: IRequestCacheEntry = {
      key,
      maxAge: cacheOption.maxAge,
      response: response,
      lastRead: Date.now(),
    };
    this.cacheStorageService.set(key, entry);

    if (this.maxAge != 0) {
      this.cacheStorageService.deleteAllByExpiration(this.prefix, this.maxAge);
    }
  }

  delete(key: string): void {
    this.cacheStorageService.delete(`${this.prefix}${key}`);
  }

  deleteAll(): void {
    this.cacheStorageService.deleteAll(this.prefix);
  }

  /** localStorage accepts only string as value so have to convert httpResponse object
    to string using <JSON.stringify>. <JSON.stringify> will process only the properties 
    in the object and ignore the methods so inbuilt methods of HttpResponse object are 
    ignored and http.get not consider the returned object as HttpResponse object. 
    To resolve this issue, Created a HttpResponse object and mapped the cached response entry to the
    new HttpResponse object and return it. */
  private getResponse(cached: ICacheEntry): HttpResponse<any> | undefined {
    return new HttpResponse({
      body: (cached as IRequestCacheEntry).response.body,
      headers: (cached as IRequestCacheEntry).response.headers,
      status: (cached as IRequestCacheEntry).response.status,
      statusText: (cached as IRequestCacheEntry).response.statusText,
      url: (cached as IRequestCacheEntry).response.url as string,
    });
  }
}
