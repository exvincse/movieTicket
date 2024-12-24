/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import cookies from "js-cookie";
import { Observable } from "rxjs";

/**
 * AuthHttpInterceptorService
 * @param req req
 * @param next next
 * @returns req
 */
export const AuthHttpInterceptorService: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const token = cookies.get("accessToken");
    const newReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    console.log(req);
    return next(newReq);
};
