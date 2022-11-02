import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AppService } from './app.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheStorageService } from './cache/cache-storage/cache-storage.service';
import { LocalStorageCacheService } from './cache/cache-storage/local-storage-cache.service';
import { CachingInterceptor } from './cache/caching-interceptor';
import { RequestCacheService } from './cache/request-cache.service';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [AppComponent, HelloComponent],
  providers: [
    AppService,
    RequestCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
    { provide: CacheStorageService, useClass: LocalStorageCacheService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
