import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TmdbApiService } from "../TMDBApiService.service";
import { TmdbApiUrl } from "./url";
/**
 * RepositoryService
 */
@Injectable({
    providedIn: "root",
})
export class TmdbRepositoryService {
    /**
     * constructor
     * @param tmdbApiService tmdbApiService
     */
    constructor(public tmdbApiService: TmdbApiService) { }

    /**
     * 取得電影列表
     * @param params params
     * @returns any
     */
    getMovieList(params: any): Observable<any> {
        return this.tmdbApiService.get(TmdbApiUrl.getMovieList, params);
    }
}
