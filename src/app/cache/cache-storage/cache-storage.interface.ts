import { HttpResponse } from '@angular/common/http';

export interface ICacheStorageService {
  get(key: string): ICacheEntry;
  set(key: string, value: ICacheEntry): void;
  delete(key: string): void;
  deleteAll(prefix: string): void;
  deleteAllByExpiration(prefix: string, maxAge: number): void;
}

export interface ICacheEntry {
  key: string;
  lastRead: number;
  maxAge?: number;
}

export interface IRequestCacheEntry extends ICacheEntry {
  response: HttpResponse<any>;
}

export interface ICommonCacheEntry extends ICacheEntry {
  value: string;
}

export interface ICacheOptions {
  key?: string;
  /** Give milliseconds to expire the cache */
  maxAge?: number;
}
