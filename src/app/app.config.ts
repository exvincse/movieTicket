import { provideHttpClient } from "@angular/common/http";
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";

import { environment } from "../environments/environment";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(),
        {
            provide: APP_INITIALIZER,
            // eslint-disable-next-line jsdoc/require-jsdoc
            useFactory: () => async () => {
                if (!environment.production && environment.enableMocking) {
                    const { worker } = await import("./core/models/mocks/browser");
                    await worker.start({
                        onUnhandledRequest: "bypass",
                        serviceWorker: {
                            url: "/mockServiceWorker.js",
                            options: {
                                scope: "/",
                            },
                        },
                    });
                }
            },
            multi: true
        },
    ]
};
