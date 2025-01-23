/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import cookies from "js-cookie";
import { Observable } from "rxjs";

/**
 * RequestInterceptor
 * @param req req
 * @param next next
 * @returns req
 */
export const RequestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const token = cookies.get("accessToken");

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
