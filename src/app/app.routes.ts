import { Routes } from "@angular/router";

import { CheckLoginAuthGuard } from "./core/guard/check-login.auth.guard";
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
                path: "login",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/login/login.component").then((m) => m.LoginComponent),
            },
            {
                path: "register",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/register/register.component").then((m) => m.RegisterComponent),
            },
            {
                path: "forgetPassword",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/forget-password/forget-password.component").then((m) => m.ForgetPasswordComponent),
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
                canActivate: [CheckLoginAuthGuard],
                canActivateChild: [CheckLoginAuthGuard],
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/personal/personal.component").then((m) => m.PersonalComponent),
                children: [...personalRoutes]
            },
            {
                path: "paypal-success",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/pay-pal/pay-pal-success/pay-pal-success.component").then((m) => m.PayPalSuccessComponent),
            },
            {
                path: "paypal-error",
                // eslint-disable-next-line jsdoc/require-jsdoc
                loadComponent: () => import("./modules/front-platform/pay-pal/pay-pal-error/pay-pal-error.component").then((m) => m.PayPalErrorComponent),
            },
        ]
    },
];
