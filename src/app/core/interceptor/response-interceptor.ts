import {
    HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { TextAlertComponent } from "@shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@shared/base/component/sweet-alert/service/sweet-alert.service";
import {
    catchError, concatMap, finalize, Observable,
    tap,
    throwError
} from "rxjs";

import { CookieService } from "../../services/cookie.service";
import { LoaderService } from "../../services/loader/loader.service";
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
    const loaderService = inject(LoaderService);
    const router = inject(Router);

    if (req.urlWithParams.includes("themoviedb")) {
        return next(req).pipe(
            finalize(() => {
                // api loading動畫，只要有回來請求動畫累積次數就會減1
                loaderService.stopLoadingCount();
            })
        );
    }

    return next(req).pipe(
        tap((response) => {
            if (response instanceof HttpResponse && response.url?.includes("GetIsCheckLogin") === true) {
                const responseBody = response.body as BaseApiOutputModel<boolean>;
                if (responseBody.result === false) {
                    userStoreService.setClearUserData();
                    userStoreService.setUserIsLogin(false);
                }
            }
            return response;
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && error.error?.result?.isReNewToken === true) {
                return userRepositoryService.getReFreshToken().pipe(
                    concatMap((res) => {
                        cookiesService.set("accessToken", res.result.accessToken, 60);
                        userStoreService.setUserIsLogin(true);

                        const modifiedReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.result.accessToken}`
                            }
                        });
                        return next(modifiedReq);
                    }),
                    catchError(() => {
                        userStoreService.setClearUserData();
                        userStoreService.setUserIsLogin(false);
                        const ref = sweetAlertService.open(TextAlertComponent, {
                            icon: "error",
                            data: {
                                text: "登入已逾時，請重新登入"
                            }
                        });

                        ref.instance.afterClose.subscribe(() => {
                            router.navigate(["/"]);
                        });

                        return throwError(() => error);
                    })
                );
            }

            if (error.error?.result?.isRepeatLogin === true) {
                userStoreService.setClearUserData();
                userStoreService.setUserIsLogin(false);
                const ref = sweetAlertService.open(TextAlertComponent, {
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
        }),
        finalize(() => {
            // api loading動畫，只要有回來請求動畫累積次數就會減1
            loaderService.stopLoadingCount();
        })
    );
};
