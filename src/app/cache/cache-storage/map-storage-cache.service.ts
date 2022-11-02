import { Injectable } from '@angular/core';
import { ICacheEntry } from './cache-storage.interface';
import { CacheStorageService } from './cache-storage.service';

@Injectable()
export class MapStorageCacheService extends CacheStorageService {
  cache = new Map<string, ICacheEntry>();
  get(key: string): ICacheEntry {
    return this.cache.get(key) as ICacheEntry;
  }
  set(key: string, value: ICacheEntry): void {
    this.cache.set(key, value);
  }
  delete(key: string): void {
    this.cache.delete(key);
  }
  deleteAll(prefix: string): void {
    this.cache.forEach((expiredEntry) => {
      if (expiredEntry.key.startsWith(prefix)) {
        this.cache.delete(expiredEntry.key);
      }
    });
  }
  deleteAllByExpiration(prefix: string, maxAge: number): void {
    this.cache.forEach((expiredEntry) => {
      let expired = expiredEntry.maxAge
        ? Date.now() - expiredEntry.maxAge
        : Date.now() - maxAge;
      if (
        expiredEntry.key.startsWith(prefix) &&
        expiredEntry.lastRead < expired
      ) {
        this.cache.delete(expiredEntry.key);
      }
    });
  }
}
