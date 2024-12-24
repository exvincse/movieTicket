/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment.development";

/**
 * ApiService
 */
@Injectable({
    providedIn: "root"
})
export class ApiService {
    private baseApiUrl = environment.apiUrl;

    /**
     * constructor
     * @param http http
     */
    constructor(private http: HttpClient) { }

    /**
     * restful get
     * @param url url
     * @param params params
     * @returns req
     */
    get(url: string, params?: any): Observable<any> {
        if (params) {
            const newParams = new URLSearchParams();

            Object.keys(params).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    newParams.append(key, params[key]);
                }
            });

            return this.http.get(`${this.baseApiUrl}/${url}?${newParams.toString()}`);
        }

        return this.http.get(`${this.baseApiUrl}/${url}`);
    }

    /**
     * restful post
     * @param url url
     * @param data data
     * @returns req
     */
    post(url: string, data: any): Observable<any> {
        const options = {
            headers: new HttpHeaders().set("Content-Type", "application/json"),
        };

        return this.http.post(`${this.baseApiUrl}/${url}`, data, options);
    }

    /**
     * restful put
     * @param url url
     * @param data data
     * @returns req
     */
    put(url: string, data: any): Observable<any> {
        const options = {
            headers: new HttpHeaders().set("Content-Type", "application/json"),
        };

        return this.http.put(`${this.baseApiUrl}/${url}`, data, options);
    }
}
