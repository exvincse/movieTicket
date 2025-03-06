import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
    APP_INITIALIZER, ApplicationConfig, importProvidersFrom, Injector, isDevMode, provideZoneChangeDetection
} from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withHashLocation } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

import { isLoginFactory } from "./app.initializer";
import { routes } from "./app.routes";
import { RequestInterceptor } from "./core/interceptor/request-interceptor";
import { ResponseInterceptor } from "./core/interceptor/response-interceptor";
import { appReducer } from "./store/app.reducer";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes, withHashLocation()),
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
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: isLoginFactory,
            deps: [Injector],
            multi: true,
        },
        importProvidersFrom(SweetAlert2Module.forRoot())
    ]
};
