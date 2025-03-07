/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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

            return this.http.get<T>(`${this.baseApiUrl}/${url}?${newParams.toString()}`);
        }

        return this.http.get<T>(`${this.baseApiUrl}/${url}`);
    }

    /**
     * restful post
     * @param url url
     * @param data data
     * @returns req
     */
    post<T>(url: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.baseApiUrl}/${url}`, data);
    }

    /**
     * restful put
     * @param url url
     * @param data data
     * @returns req
     */
    put<T>(url: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.baseApiUrl}/${url}`, data);
    }
}
