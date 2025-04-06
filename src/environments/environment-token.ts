import { InjectionToken } from "@angular/core";

import { environment } from "./environment";

export const ENVIRONMENT = new InjectionToken<{
    production: boolean;
    apiUrl: string;
    azureSubKey: string;
}>("environment", {
    providedIn: "root",
    /**
     * factory
     * @returns environment
     */
    factory: () => environment
});
