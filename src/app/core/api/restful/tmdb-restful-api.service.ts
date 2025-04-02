import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environmentTMDB } from "../../../../environments/environment";
import { RestfulApiService } from "./restful-api.service";

/**
 * ApiService
 */
@Injectable({
    providedIn: "root"
})
export class TmdbRestfulApiService extends RestfulApiService {
    protected override baseApiUrl = environmentTMDB.apiUrl;
    protected baseApiKey = environmentTMDB.apiKey;

    protected options = {
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${this.baseApiKey}`,
        }
    };

    /**
     * restful get
     * @param url url
     * @param params params
     * @returns req
     */
    override get(url: string, params?: any): Observable<any> {
        if (params) {
            const newParams = new URLSearchParams();

            Object.keys(params).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    newParams.append(key, params[key]);
                }
            });

            return this.http.get(`${this.baseApiUrl}/${url}?${newParams.toString()}`, this.options);
        }

        return this.http.get(`${this.baseApiUrl}/${url}`, this.options);
    }

    /**
     * restful post
     * @param url url
     * @param data data
     * @returns req
     */
    override post(url: string, data: any): Observable<any> {
        return this.http.post(`${this.baseApiUrl}/${url}`, data, this.options);
    }

    /**
     * restful put
     * @param url url
     * @param data data
     * @returns req
     */
    override put(url: string, data: any): Observable<any> {
        return this.http.put(`${this.baseApiUrl}/${url}`, data, this.options);
    }
}
