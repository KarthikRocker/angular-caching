import { InjectionToken } from '@angular/core';

export class AppConfig {
  CachingExpirationTime: number | any;
}

export let APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
