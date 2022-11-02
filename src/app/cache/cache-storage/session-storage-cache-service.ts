import { Injectable } from '@angular/core';
import { ICacheEntry } from './cache-storage.interface';
import { CacheStorageService } from './cache-storage.service';

@Injectable()
export class SessionStorageCacheService extends CacheStorageService {
  get(key: string): ICacheEntry {
    return JSON.parse(sessionStorage.getItem(key) as string);
  }
  set(key: string, value: ICacheEntry): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  delete(key: string): void {
    sessionStorage.removeItem(key);
  }
  deleteAll(prefix: string): void {
    for (let index = 0; index < sessionStorage.length; index++) {
      let key = sessionStorage.key(index);
      if (key?.startsWith(prefix)) {
        sessionStorage.removeItem(key);
      }
    }
  }
  deleteAllByExpiration(prefix: string, maxAge: number): void {
    for (var index = 0; index < sessionStorage.length; index++) {
      let cacheKey = sessionStorage.key(index);
      if (cacheKey?.startsWith(prefix)) {
        let expiredEntry: ICacheEntry = JSON.parse(
          sessionStorage.getItem(cacheKey) as string
        );
        let expired = expiredEntry.maxAge
          ? Date.now() - expiredEntry.maxAge
          : Date.now() - maxAge;
        if (expiredEntry.lastRead < expired) {
          sessionStorage.removeItem(expiredEntry.key);
        }
      }
    }
  }
}
