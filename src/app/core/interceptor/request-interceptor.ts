import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

import { CookieService } from "../../services/cookie.service";

/**
 * RequestInterceptor
 * @param req req
 * @param next next
 * @returns req
 */
export const RequestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const cookiesService = inject(CookieService);
    const token = cookiesService.get("accessToken");

    if (req.urlWithParams.includes("themoviedb")) {
        return next(req);
    }

    if (!req.urlWithParams.includes("Login") && token !== undefined) {
        return next(req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        }));
    }

    return next(req.clone({
        withCredentials: true
    }));
};
