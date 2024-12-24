import { HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

/**
 * BackHttpInterceptorServiceService
 */
@Injectable({
    providedIn: "root"
})
export class BackHttpInterceptorServiceService {
    /**
     * intercept
     * @param req req
     * @param next next
     * @returns req
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req);
    }
}
