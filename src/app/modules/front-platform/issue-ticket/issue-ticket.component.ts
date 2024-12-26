import { CommonModule } from "@angular/common";
import {
    Component, CUSTOM_ELEMENTS_SCHEMA, OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import * as OpenCC from "opencc-js";
import { lastValueFrom } from "rxjs";
import { SwiperOptions } from "swiper/types";

import { TmdbRepositoryService } from "../../../core/api/tmdb/tmdb.repository.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";
import { SeatChartComponent } from "../seat-chart/seat-chart.component";

/**
 * IssueTicketComponent
 */
@Component({
    selector: "app-issue-ticket",
    standalone: true,
    imports: [CommonModule, SwiperDirective, FontAwesomeModule, SeatChartComponent, StopPropagationDirective],
    templateUrl: "./issue-ticket.component.html",
    styleUrl: "./issue-ticket.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IssueTicketComponent implements OnInit {
    /**
     * constructor
     * @param route ActivatedRoute
     * @param tmdbRepositoryService tmdbRepositoryService
     */
    constructor(
        public route: ActivatedRoute,
        public tmdbRepositoryService: TmdbRepositoryService
    ) { }

    movieDetail: any = {};

    faGreaterThan = faGreaterThan;

    date = [
        "12月5日",
        "12月6日",
        "12月7日",
        "12月7日",
        "12月7日",
        "12月7日"
    ];

    swiperConfig: SwiperOptions = {
        slidesPerView: "auto",
        spaceBetween: 10,
        pagination: false,
        navigation: {
            nextEl: ".c-dateTab__next",
            prevEl: ".c-dateTab__prev"
        }
    };

    /**
     * on init
     */
    ngOnInit() {
        this.getMovieDetail();
    }

    /**
     * getMovieDetail
     */
    async getMovieDetail() {
        const converter = OpenCC.Converter({ from: "cn", to: "tw" });

        const params = {
            language: "zh-TW",
        };

        const list = await lastValueFrom(this.tmdbRepositoryService.getMovieDetail(`${this.route.snapshot.params["id"]}`, params));

        const credits = await lastValueFrom(this.tmdbRepositoryService.getMovieDetailCredits(`${this.route.snapshot.params["id"]}`, params));

        const rate = await lastValueFrom(this.tmdbRepositoryService.getMovieDetailRate(`${this.route.snapshot.params["id"]}`, params));

        this.movieDetail = {
            ...list,
            genres: converter(list.genres.map((item: { name: any; }) => item.name).join("、")),
            director: credits.crew.find((item: any) => item.job === "Director"),
            cast: credits.cast.filter((item: any) => item.order < 5).map((item: any) => item.name).join("、"),
            rate: rate.results.find((item: any) => item.iso_3166_1 === "US").release_dates[0].certification
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
