import {
    HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest
} from "@angular/common/http";
import { inject } from "@angular/core";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { Observable } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";

import { ENVIRONMENT } from "../../../environments/environment-token";
import { CookieService } from "../../services/cookie/cookie.service";
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
    const env = inject(ENVIRONMENT);
    const userStoreService = inject(UserStoreService);
    const token = cookiesService.get("accessToken");
    const reqOptions = {
        headers: new HttpHeaders(),
        withCredentials: true
    };

    return userStoreService.getSettingData().pipe(
        take(1),
        tap(() => {
            // api loading動畫，只要有發送請求動畫累積次數就會加1
            loaderService.startLoadingCount();
        }),
        switchMap((settingData) => {
            // 第三方電影api不需要加上Ocp-Apim-Subscription-Key
            if (req.urlWithParams.includes("themoviedb")) {
                reqOptions.headers = reqOptions.headers
                    .set("Authorization", `Bearer ${settingData.tmdbApiKey}`)
                    .set("accept", "application/json");

                reqOptions.withCredentials = false;
                return next(req.clone(reqOptions));
            }

            // 佈署在azure的production環境，要加上Ocp-Apim-Subscription-Key
            if (env.production === true) {
                reqOptions.headers = reqOptions.headers.set("Ocp-Apim-Subscription-Key", settingData.pdAzureSubKey);
            }

            // 除了Login api，其他api都要加上Authorization
            if (!req.urlWithParams.includes("Login") && token !== undefined) {
                reqOptions.headers = reqOptions.headers.set("Authorization", `Bearer ${token}`);
                return next(req.clone(reqOptions));
            }
            return next(req.clone(reqOptions));
        })
    );
};
