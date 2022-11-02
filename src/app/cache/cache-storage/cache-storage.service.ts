import { Injectable } from '@angular/core';
import { ICacheEntry, ICacheStorageService } from './cache-storage.interface';

@Injectable()
export class CacheStorageService implements ICacheStorageService {
  get(key: string): ICacheEntry {
    throw new Error('Method not implemented.');
  }
  set(key: string, value: ICacheEntry): void {
    throw new Error('Method not implemented.');
  }
  delete(key: string): void {
    throw new Error('Method not implemented.');
  }
  deleteAll(prefix: string): void {
    throw new Error('Method not implemented.');
  }
  deleteAllByExpiration(prefix: string, maxAge: number): void {
    throw new Error('Method not implemented.');
  }
}
