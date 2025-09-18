import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withHashLocation, withPreloading } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes, withHashLocation()),
//   provideHttpClient(),
//   provideAnimations(),
//   provideAnimations(),
//   ]
// };

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withHashLocation(),withPreloading(PreloadAllModules)),provideHttpClient(),
  provideAnimations()
  ]
};