import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import * as OpenCC from "opencc-js";
import {
    forkJoin, lastValueFrom
} from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { SweetAlertConfig } from "../../../shared/base/component/sweet-alert/sweet-alert-config";

/**
 * MovieDetailComponent
 */
@Component({
    selector: "app-movie-detail",
    imports: [CommonModule],
    standalone: true,
    templateUrl: "./movie-detail.component.html",
    styleUrl: "./movie-detail.component.scss"
})
export class MovieDetailComponent implements AfterViewInit {
    /**
     * constructor
     * @param tmdbRepositoryService tmdbRepositoryService
     * @param option SweetAlertConfig
     */
    constructor(
        public tmdbRepositoryService: TmdbRepositoryService,
        public option: SweetAlertConfig
    ) { }

    movieDetail: any = {};

    /**
     * on init
     */
    ngAfterViewInit() {
        setTimeout(() => {
            this.getMovieDetail();
        });
    }

    /**
     * getMovieDetail
     */
    async getMovieDetail() {
        const converter = OpenCC.Converter({ from: "cn", to: "tw" });

        const { list, credits, rate } = await lastValueFrom(forkJoin({
            list: this.getMovieList(),
            credits: this.getMovieDetailCredits(),
            rate: this.getMovieDetailRate()
        }));

        const movieDetailRate = rate.results.find((item: any) => item.iso_3166_1 === "US");

        this.movieDetail = {
            ...list,
            genres: converter(list.genres.map((item: { name: any; }) => item.name).join("、")),
            director: credits.crew.find((item: any) => item.job === "Director"),
            cast: credits.cast.filter((item: any) => item.order < 5).map((item: any) => item.name).join("、"),
            rate: movieDetailRate ? movieDetailRate.release_dates[0].certification : ""
        };

        switch (this.movieDetail.rate) {
            case "R":
                this.movieDetail.rateImg = "rating_18";
                break;
            case "PG-13":
                this.movieDetail.rateImg = "rating_12";
                break;
            case "15":
                this.movieDetail.rateImg = "rating_15";
                break;
            default:
                this.movieDetail.rateImg = "rating";
                break;
        }
    }

    /**
     * getMovieList
     * @returns movieList
     */
    async getMovieList() {
        return lastValueFrom(this.tmdbRepositoryService.getMovieDetail(`${this.option.data.id}`, {
            language: "zh-TW"
        }));
    }

    /**
     * getMovieDetailCredits
     * @returns movieList
     */
    async getMovieDetailCredits() {
        return lastValueFrom(this.tmdbRepositoryService.getMovieDetailCredits(`${this.option.data.id}`, {
            language: "zh-TW"
        }));
    }

    /**
    * getMovieDetailRate
    * @returns movieList
    */
    async getMovieDetailRate() {
        return lastValueFrom(this.tmdbRepositoryService.getMovieDetailRate(`${this.option.data.id}`, {
            language: "zh-TW"
        }));
    }
}
