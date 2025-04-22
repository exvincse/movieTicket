import { Routes } from "@angular/router";

export const personalRoutes: Routes = [
    {
        path: "base",
        // eslint-disable-next-line jsdoc/require-jsdoc
        loadComponent: () => import("./base/base.component").then((m) => m.BaseComponent),
    },
    {
        path: "ticket",
        // eslint-disable-next-line jsdoc/require-jsdoc
        loadComponent: () => import("./ticket/ticket.component").then((m) => m.TicketComponent),
    },
    {
        path: "**",
        redirectTo: "base",
        pathMatch: "full",
    }
];
