import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { routes } from "./app.routes";
import { RequestInterceptor } from "./core/interceptor/request-interceptor";
import { ResponseInterceptor } from "./core/interceptor/response-interceptor";
import { appReducer } from "./store/app.reducer";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([
                RequestInterceptor,
                ResponseInterceptor
            ])
        ),
        provideStore(appReducer),
        provideEffects([
        ]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
        })
    ]
};
