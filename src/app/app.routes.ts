import { Routes } from "@angular/router";

import { personalRoutes } from "./modules/front-platform/personal/personal.routes";

export const routes: Routes = [
    {
        path: "",
        // eslint-disable-next-line jsdoc/require-jsdoc
        loadComponent: () => import("./shared/layouts/main-layout/main-layout.component").then((m) => m.MainLayoutComponent),
        children: [
            {
                path: "",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/index-page/index-page.component").then((m) => m.IndexPageComponent),
            },
            {
                path: "ticketing/:id",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/issue-ticket/issue-ticket.component").then((m) => m.IssueTicketComponent),
            },
            {
                path: "movieList",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/movie-list/movie-list.component").then((m) => m.MovieListComponent),
            },
            {
                path: "personal",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/personal/personal.component").then((m) => m.PersonalComponent),
                children: [...personalRoutes]
            }
        ]
    },
];
