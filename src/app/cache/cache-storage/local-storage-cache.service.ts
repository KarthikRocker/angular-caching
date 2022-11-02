import { Injectable } from '@angular/core';
import { ICacheEntry } from './cache-storage.interface';
import { CacheStorageService } from './cache-storage.service';

@Injectable()
export class LocalStorageCacheService extends CacheStorageService {
  get(key: string): ICacheEntry {
    return JSON.parse(localStorage.getItem(key) as string);
  }
  set(key: string, value: ICacheEntry): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  delete(key: string): void {
    localStorage.removeItem(key);
  }
  deleteAll(prefix: string): void {
    for (let index = 0; index < localStorage.length; index++) {
      let key = localStorage.key(index);
      if (key?.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
  deleteAllByExpiration(prefix: string, maxAge: number): void {
    for (var index = 0; index < localStorage.length; index++) {
      let cacheKey = localStorage.key(index);
      if (cacheKey?.startsWith(prefix)) {
        let expiredEntry: ICacheEntry = JSON.parse(
          localStorage.getItem(cacheKey) as string
        );
        let expired = expiredEntry.maxAge
          ? Date.now() - expiredEntry.maxAge
          : Date.now() - maxAge;
        if (expiredEntry.lastRead < expired) {
          localStorage.removeItem(expiredEntry.key);
        }
      }
    }
  }
}
