import { CommonModule } from "@angular/common";
import {
    Component, CUSTOM_ELEMENTS_SCHEMA, OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { lastValueFrom } from "rxjs";
import { SwiperOptions } from "swiper/types";

import { TmdbRepositoryService } from "../../../core/api/tmdb/tmdb.repository.service";
import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";

/**
 * IndexPageComponent
 */
@Component({
    selector: "app-index-page",
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, SwiperDirective, RouterModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: "./index-page.component.html",
    styleUrl: "./index-page.component.scss"
})
export class IndexPageComponent implements OnInit {
    /**
     * constructor
     * @param tmdbRepositoryService tmdbRepositoryService
     */
    constructor(public tmdbRepositoryService: TmdbRepositoryService) { }

    faGreaterThan = faGreaterThan;
    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;

    bannerImage = [
        "https://capi.showtimes.com.tw/assets/b2/b27a8f4185dffe0c4d9b57b4b6dd6b2f.png",
        "https://capi.showtimes.com.tw/assets/b2/b27a8f4185dffe0c4d9b57b4b6dd6b2f.png"
    ];

    bannerSwiperConfig: SwiperOptions = {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: false,
        navigation: false,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false
        }
    };

    movieListConfig: SwiperOptions = {
        ...this.bannerSwiperConfig,
        navigation: {
            nextEl: ".swiper-button-next1",
            prevEl: ".swiper-button-prev1",
        },
        loop: false,
        autoplay: false,

        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 5
            }
        }
    };

    comingMovieListConfig: SwiperOptions = {
        ...this.movieListConfig,
        navigation: {
            nextEl: ".swiper-button-next2",
            prevEl: ".swiper-button-prev2",
        },
    };

    hotMovieList: any[] = [];

    comingMovieList: any[] = [];

    total = 0;

    /**
     * on init
     */
    async ngOnInit() {
        const hotStartDate = moment().startOf("month");
        const hotEndDate = moment().endOf("month");
        const hotRes = await this.getAllMovieList(1, hotStartDate.format("YYYY-MM-DD"), hotEndDate.format("YYYY-MM-DD"));
        this.hotMovieList = hotRes.results;

        const comingStartDate = moment().startOf("month").add(1, "month");
        const comingEndDate = moment().endOf("month").add(1, "month");
        const comingRes = await this.getAllMovieList(1, comingStartDate.format("YYYY-MM-DD"), comingEndDate.format("YYYY-MM-DD"));
        this.comingMovieList = comingRes.results;
    }

    /**
     * getAllMovieList
     * @param page page
     * @param startDate startDate
     * @param endDate endDate
     * @returns res res
     */
    async getAllMovieList(page = 1, startDate?: string, endDate?: string) {
        const params = {
            language: "zh-TW",
            sort_by: "popularity.desc",
            "primary_release_date.gte": startDate || "",
            "primary_release_date.lte": endDate || "",
            page
        };

        const res = await lastValueFrom(this.tmdbRepositoryService.getMovieList(params));
        return res;
    }
}
