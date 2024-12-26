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
    getMovieList<T extends { language: string }>(params: T): Observable<any> {
        return this.tmdbApiService.get(TmdbApiUrl.getMovieList, params);
    }

    /**
     * 取得電影詳細資料
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetail<T extends { language: string }>(id: string, params: T): Observable<any> {
        return this.tmdbApiService.get(`${TmdbApiUrl.getMovieDetail}/${id}`, params);
    }

    /**
     * 取得電影演員
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetailCredits<T extends { language: string }>(id: string, params: T): Observable<any> {
        return this.tmdbApiService.get(`${TmdbApiUrl.getMovieDetail}/${id}/credits`, params);
    }

    /**
     * 取得電影分級
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetailRate<T extends { language: string }>(id: string, params: T): Observable<any> {
        return this.tmdbApiService.get(`${TmdbApiUrl.getMovieDetail}/${id}/release_dates`, params);
    }

    /**
     * 取得電影類型
     * @param params params
     * @returns any
     */
    getMovieGenre<T extends { language: string }>(params: T): Observable<any> {
        return this.tmdbApiService.get(`${TmdbApiUrl.getMovieGenre}`, params);
    }
}
