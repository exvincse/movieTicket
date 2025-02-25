import {
    HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    catchError, concatMap, map, Observable,
    throwError
} from "rxjs";

import { CookieService } from "../../services/cookie.service";
import { SweetAlertService } from "../../shared/base/component/sweet-alert/service/sweet-alert.service";
import { SweetAlertComponent } from "../../shared/base/component/sweet-alert/sweet-alert.component";
import { UserStoreService } from "../../store/user/service/user-store.service";
import { UserRepositoryService } from "../api/middleware/user/user-repository.service";
import { BaseApiOutputModel } from "../models/outputViewModels/base/base-api-output-model";

/**
 * RequestInterceptor
 * @param req req
 * @param next next
 * @returns req
 */
export const ResponseInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const userRepositoryService = inject(UserRepositoryService);
    const cookiesService = inject(CookieService);
    const userStoreService = inject(UserStoreService);
    const sweetAlertService = inject(SweetAlertService);
    const router = inject(Router);

    if (req.urlWithParams.includes("themoviedb")) {
        return next(req);
    }

    return next(req).pipe(
        map((response) => {
            if (response instanceof HttpResponse) {
                if (response.url?.includes("GetIsCheckLogin") === true) {
                    const responseBody = response.body as BaseApiOutputModel<boolean>;
                    if (responseBody.result === false) {
                        userStoreService.setClearUserData();
                        router.navigate(["/"]);
                    }
                }
            }
            return response;
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && error.error?.result?.isReNewToken === true) {
                return userRepositoryService.getReFreshToken().pipe(
                    concatMap((res) => {
                        cookiesService.set("accessToken", res.result.accessToken, 5);

                        const modifiedReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.result.accessToken}`
                            }
                        });
                        return next(modifiedReq);
                    }),
                    catchError(() => throwError(() => new Error("refresh token error")))
                );
            }

            if (error.error?.result?.isRepeatLogin === true) {
                userStoreService.setClearUserData();
                const ref = sweetAlertService.open(SweetAlertComponent, {
                    icon: "error",
                    data: {
                        text: "登入已逾時，請重新登入"
                    }
                });

                ref.instance.afterClose.subscribe(() => {
                    router.navigate(["/"]);
                });
            }

            return throwError(() => error);
        })
    );
};
