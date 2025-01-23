/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest
} from "@angular/common/http";
import { inject } from "@angular/core";
import cookies from "js-cookie";
import {
    catchError, Observable,
    switchMap,
    throwError
} from "rxjs";

import { UserRepositoryService } from "../api/middleware/user/user-repository.service";
/**
 * RequestInterceptor
 * @param req req
 * @param next next
 * @returns req
 */
export const ResponseInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const userRepositoryService = inject(UserRepositoryService);

    if (req.urlWithParams.includes("themoviedb")) {
        return next(req);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && error.error?.result?.isReNewToken === true) {
                return userRepositoryService.getReFreshToken().pipe(
                    switchMap((res) => {
                        cookies.set("accessToken", res.result.accessToken, { expires: 7 });

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
