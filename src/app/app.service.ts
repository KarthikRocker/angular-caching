import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICacheOptions } from './cache/cache-storage/cache-storage.interface';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  GetUser(id: number, cacheOption?: ICacheOptions): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('cache', JSON.stringify(cacheOption));
    return this.http.get(`https://reqres.in/api/users/${id}`, {
      headers,
    });
  }
}
