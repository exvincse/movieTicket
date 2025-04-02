import { Injectable } from "@angular/core";
import { MovieCreditsOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-credits-output.model";
import { MovieDetailOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-detail-output.model";
import { MovieGenreOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-genre-output.model";
import { MovieListOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-list-output.model";
import { MovieReleaseDateOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-release-date-output.model";
import { forkJoin, Observable } from "rxjs";

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
    getMovieList<T extends { language: string }>(params: T): Observable<MovieListOutputModelEntity> {
        return this.tmdbRestfulApiService.get(TmdbUrl.getMovieList, params);
    }

    /**
     * 取得電影合併資料
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieMergeDetail<T extends { language: string }>(id: string, params: T): Observable<{
        list: MovieDetailOutputModelEntity;
        credits: MovieCreditsOutputModelEntity;
        rate: MovieReleaseDateOutputModelEntity;
    }> {
        return forkJoin({
            list: this.getMovieDetail(id, params),
            credits: this.getMovieDetailCredits(id, params),
            rate: this.getMovieDetailRate(id, params),
        });
    }

    /**
     * 取得電影詳細資料
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetail<T extends { language: string }>(id: string, params: T): Observable<MovieDetailOutputModelEntity> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieDetail}/${id}`, params);
    }

    /**
     * 取得電影演員
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetailCredits<T extends { language: string }>(id: string, params: T): Observable<MovieCreditsOutputModelEntity> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieDetail}/${id}/credits`, params);
    }

    /**
     * 取得電影分級
     * @param id id
     * @param params params
     * @returns any
     */
    getMovieDetailRate<T extends { language: string }>(id: string, params: T): Observable<MovieReleaseDateOutputModelEntity> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieDetail}/${id}/release_dates`, params);
    }

    /**
     * 取得電影類型
     * @param params params
     * @returns any
     */
    getMovieGenre<T extends { language: string }>(params: T): Observable<MovieGenreOutputModelEntity> {
        return this.tmdbRestfulApiService.get(`${TmdbUrl.getMovieGenre}`, params);
    }
}
