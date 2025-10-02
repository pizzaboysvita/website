import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { authInterceptor } from "./app/core/interceptors/auth.interceptor";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])), // ✅ use function interceptor
    provideRouter(routes, withHashLocation()), // ✅ use hash location strategy
  ],
}).catch((err) => console.error(err));