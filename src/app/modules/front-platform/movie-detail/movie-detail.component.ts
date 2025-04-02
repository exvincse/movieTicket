import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { MovieDetailEntity } from "@app/core/models/entities/movie/movie-detail-entity";
import * as OpenCC from "opencc-js";
import { lastValueFrom } from "rxjs";

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

    movieDetail: MovieDetailEntity = {
        id: 0,
        title: "",
        genres: "",
        director: "",
        cast: "",
        rate: "",
        rateImg: "",
        adult: false,
        backdrop_path: "",
        belongs_to_collection: "",
        budget: 0,
        homepage: "",
        imdb_id: "",
        original_language: "",
        original_title: "",
        overview: "",
        popularity: 0,
        poster_path: "",
        production_companies: [],
        production_countries: [],
        release_date: "",
        revenue: 0,
        runtime: 0,
        spoken_languages: [],
        status: "",
        tagline: "",
        video: false,
        vote_average: 0,
        vote_count: 0,
        origin_country: []
    };

    /**
     * on init
     */
    ngAfterViewInit() {
        setTimeout(() => {
            this.getMovieDetail();
        });
    }

    /**
     * 取得電影合併資料
     */
    async getMovieDetail() {
        const converter = OpenCC.Converter({ from: "cn", to: "tw" });

        const movieId = this.option.data.id;

        const params = {
            language: "zh-TW",
        };

        const { list, credits, rate } = await lastValueFrom(this.tmdbRepositoryService.getMovieMergeDetail(movieId, params));

        const movieDetailRate = rate.results.find((item) => item.iso_3166_1 === "US");

        const director = credits.crew.find((item) => item.job === "Director")?.name || "";

        const cast = credits.cast.filter((item) => item.order < 5).map((item) => item.name).join("、") || "";

        this.movieDetail = {
            ...list,
            genres: converter(list.genres.map((item) => item.name).join("、")),
            director,
            cast,
            rate: movieDetailRate ? movieDetailRate.release_dates[0].certification : "",
            rateImg: ""
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
}
