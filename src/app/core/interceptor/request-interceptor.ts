import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

import { CookieService } from "../../services/cookie.service";
import { LoaderService } from "../../services/loader/loader.service";

/**
 * RequestInterceptor
 * @param req req
 * @param next next
 * @returns req
 */
export const RequestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const cookiesService = inject(CookieService);
    const loaderService = inject(LoaderService);
    const token = cookiesService.get("accessToken");
    // api loading動畫，只要有發送請求動畫累積次數就會加1
    loaderService.startLoadingCount();

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
