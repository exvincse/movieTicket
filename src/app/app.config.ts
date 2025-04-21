import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {
    APP_INITIALIZER, ApplicationConfig, importProvidersFrom, Injector, isDevMode, provideZoneChangeDetection
} from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import {
    provideRouter, withHashLocation, withInMemoryScrolling
} from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { provideState, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { environment } from "src/environments/environment";

import { isLoginFactory } from "./app.initializer";
import { routes } from "./app.routes";
import { RequestInterceptor } from "./core/interceptor/request-interceptor";
import { ResponseInterceptor } from "./core/interceptor/response-interceptor";
import { appEffects } from "./store/app.effects";
import { appReducer } from "./store/app.reducer";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            ...(environment.production ? [] : [withHashLocation()]),
            withInMemoryScrolling({ scrollPositionRestoration: "top" })
        ),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([
                RequestInterceptor,
                ResponseInterceptor
            ])
        ),
        provideStore(),
        ...appReducer.map(provideState),
        provideEffects(...appEffects),
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
