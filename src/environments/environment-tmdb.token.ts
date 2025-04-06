import { InjectionToken } from "@angular/core";

import { environmentTMDB } from "./environment";

export const ENVIRONMENT_TMDB = new InjectionToken<{
    production: boolean;
    apiUrl: string;
    apiKey: string;
}>("environmentTMDB", {
    providedIn: "root",
    /**
     * factory
     * @returns environmentTMDB
     */
    factory: () => environmentTMDB
});
