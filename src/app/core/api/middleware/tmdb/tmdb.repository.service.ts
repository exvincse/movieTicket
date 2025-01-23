import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TmdbUrl } from "../../api-url/tmdb-url";
import { TmdbRestfulApiService } from "../../restful/tmdb-restful-api.service";
/**
 * RepositoryService
 */
@Injectable({
    providedIn: "root",
})
export class TmdbRepositoryService {
    /**
     * constructor
     * @param tmdbRestfulApiService TmdbRestfulApiService
     */
    constructor(public tmdbRestfulApiService: TmdbRestfulApiService) { }

    /**
     * 取得電影列表
     * @param params params
     * @returns any
     */
    getMovieList<T extends { language: string }>(params: T): Observable<any> {
        return this.tmdbRestfulApiService.get(TmdbUrl.getMovieList, params);
    }

    /**
     * 取得電影詳細資料
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetail<T extends { language: string }>(id: string, params: T): Observable<any> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieDetail}/${id}`, params);
    }

    /**
     * 取得電影演員
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetailCredits<T extends { language: string }>(id: string, params: T): Observable<any> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieDetail}/${id}/credits`, params);
    }

    /**
     * 取得電影分級
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetailRate<T extends { language: string }>(id: string, params: T): Observable<any> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieDetail}/${id}/release_dates`, params);
    }

    /**
     * 取得電影類型
     * @param params params
     * @returns any
     */
    getMovieGenre<T extends { language: string }>(params: T): Observable<any> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieGenre}`, params);
    }
}
