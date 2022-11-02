import { Component } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { AppService } from './app.service';
import { ICacheOptions } from './cache/cache-storage/cache-storage.interface';
import { RequestCacheService } from './cache/request-cache.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular Caching';
  user = '';
  message = '';
  timer: number = 0;
  source: Subscription;
  timeout: any;
  constructor(
    private appService: AppService,
    private cache: RequestCacheService
  ) {}

  LoadUser(id: number): void {
    let cacheOption: ICacheOptions = Object.assign({ maxAge: 5000 });
    this.appService.GetUser(id, cacheOption).subscribe((user) => {
      this.user = JSON.stringify(user.data);
      this.source = timer(1000, 1000).subscribe((val) => {
        this.timer = val + 1;
      });
      this.timeout = setTimeout(() => {
        this.user = '';
        this.source.unsubscribe();
      }, cacheOption.maxAge);
    });
  }

  clearCache(): void {
    this.cache.deleteAll();
    if (!this.source.closed) {
      this.source.unsubscribe();
    }
    clearTimeout(this.timeout);
  }

  resetUi(): void {
    if (!this.source.closed) {
      this.source.unsubscribe();
    }
    clearTimeout(this.timeout);
    this.user = '';
    this.timer = 0;
  }
}
