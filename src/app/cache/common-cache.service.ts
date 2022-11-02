import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from '../app-config';
import {
  ICacheEntry,
  ICommonCacheEntry,
} from './cache-storage/cache-storage.interface';
import { CacheStorageService } from './cache-storage/cache-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CommonCacheService {
  private readonly prefix: string = 'CommonCache_';

  private maxAge: number;
  constructor(
    private cacheStorageService: CacheStorageService,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.maxAge = appConfig.CachingExpirationTime ?? 0;
  }

  get(key: string): string | undefined {
    let cached: ICacheEntry = this.cacheStorageService.get(
      `${this.prefix}${key}`
    );
    if (!cached) {
      return undefined;
    }

    const isExpired =
      this.maxAge != 0 &&
      cached.lastRead < Date.now() - (cached.maxAge ?? this.maxAge);
    return (cached as ICommonCacheEntry).value;
  }

  put(key: string, value: string, maxAge?: number): void {
    this.cacheStorageService.set(`${this.prefix}${key}`, {
      key,
      value,
      lastRead: Date.now(),
      maxAge,
    } as ICommonCacheEntry);

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
}
