import {
    HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest
} from "@angular/common/http";
import { inject } from "@angular/core";
import {
    catchError, Observable,
    switchMap,
    throwError
} from "rxjs";

import { CookieService } from "../../services/cookie.service";
import { UserRepositoryService } from "../api/middleware/user/user-repository.service";
/**
 * RequestInterceptor
 * @param req req
 * @param next next
 * @returns req
 */
export const ResponseInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const userRepositoryService = inject(UserRepositoryService);
    const cookiesService = inject(CookieService);

    if (req.urlWithParams.includes("themoviedb")) {
        return next(req);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && error.error?.result?.isReNewToken === true) {
                return userRepositoryService.getReFreshToken().pipe(
                    switchMap((res) => {
                        cookiesService.set("accessToken", res.result.accessToken, 5);
                        const modifiedReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.result.accessToken}`
                            }
                        });
                        return next(modifiedReq);
                    }),
                    catchError(() => throwError(() => new Error("Failed to refresh token")))
                );
            }

            return throwError(() => error);
        })
    );
};
