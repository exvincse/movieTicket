import {
    HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest
} from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
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
    const token = cookiesService.get("accessToken");
    const reqOptions = {
        headers: new HttpHeaders(),
        withCredentials: true
    };

    // api loading動畫，只要有發送請求動畫累積次數就會加1
    loaderService.startLoadingCount();

    // 第三方電影api不需要加上Authorization跟Ocp-Apim-Subscription-Key
    if (req.urlWithParams.includes("themoviedb")) {
        return next(req);
    }

    // 佈署在azure的production環境，要加上Ocp-Apim-Subscription-Key
    if (environment.production === true) {
        reqOptions.headers = reqOptions.headers.set("Ocp-Apim-Subscription-Key", environment.azureSubKey);
    }

    // 除了Login api，其他api都要加上Authorization
    if (!req.urlWithParams.includes("Login") && token !== undefined) {
        reqOptions.headers = reqOptions.headers.set("Authorization", `Bearer ${token}`);
        return next(req.clone(reqOptions));
    }

    return next(req.clone(reqOptions));
};
