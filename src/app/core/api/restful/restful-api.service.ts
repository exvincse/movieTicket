/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    catchError, map, Observable, throwError
} from "rxjs";

import { environment } from "../../../../environments/environment";

/**
 * RestfulApiService
 */
@Injectable({
    providedIn: "root"
})
export class RestfulApiService {
    protected baseApiUrl = environment.apiUrl;

    /**
     * constructor
     * @param http http
     */
    constructor(protected http: HttpClient) { }

    /**
     * restful get
     * @param url url
     * @param params params
     * @returns req
     */
    get<T>(url: string, params?: any): Observable<T> {
        if (params) {
            const newParams = new URLSearchParams();

            Object.keys(params).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    newParams.append(key, params[key]);
                }
            });

            return this.http.get<T>(`${this.baseApiUrl}/${url}?${newParams.toString()}`)
                .pipe(
                    map((response) => response),
                    catchError((error) => throwError(() => error))
                );
        }

        return this.http.get<T>(`${this.baseApiUrl}/${url}`);
    }

    /**
     * restful post
     * @param url url
     * @param params params
     * @returns req
     */
    post<T>(url: string, params: any): Observable<T> {
        return this.http.post<T>(`${this.baseApiUrl}/${url}`, params)
            .pipe(
                map((response) => response),
                catchError((error) => throwError(() => error))
            );
    }

    /**
     * restful put
     * @param url url
     * @param params params
     * @returns req
     */
    put<T>(url: string, params: any): Observable<T> {
        return this.http.put<T>(`${this.baseApiUrl}/${url}`, params)
            .pipe(
                map((response) => response),
                catchError((error) => throwError(() => error))
            );
    }
}
