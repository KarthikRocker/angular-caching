import './polyfills';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { APP_CONFIG } from './app/app-config';

fetch('./appsettings.json')
  .then((configuration) => {
    console.log(JSON.stringify(configuration));
    configuration.json();
  })
  .then((configuration: any) => {
    configuration = configuration ?? { CachingExpirationTime: 79200000 };
    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: configuration }])
      .bootstrapModule(AppModule)
      .then((ref) => {
        // Ensure Angular destroys itself on hot reloads.
        if (window['ngRef']) {
          window['ngRef'].destroy();
        }
        window['ngRef'] = ref;

        // Otherwise, log the boot error
      })
      .catch((err) => console.error(err));
  });
