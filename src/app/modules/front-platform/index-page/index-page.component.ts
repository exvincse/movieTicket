import { CommonModule } from "@angular/common";
import {
    Component, CUSTOM_ELEMENTS_SCHEMA, OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { StopPropagationDirective } from "@app/shared/base/directives/stop-propagation/stop-propagation.directive";
import { SwiperDirective } from "@app/shared/base/directives/swiper/swiper.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { SweetAlertService } from "@shared/base/component/sweet-alert/service/sweet-alert.service";
import moment from "moment";
import { lastValueFrom } from "rxjs";
import { SwiperOptions } from "swiper/types";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { MovieDetailComponent } from "../movie-detail/movie-detail.component";

/**
 * IndexPageComponent
 */
@Component({
    selector: "app-index-page",
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, SwiperDirective, RouterModule, StopPropagationDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: "./index-page.component.html",
    styleUrl: "./index-page.component.scss"
})
export class IndexPageComponent implements OnInit {
    /**
     * constructor
     * @param tmdbRepositoryService tmdbRepositoryService
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public tmdbRepositoryService: TmdbRepositoryService,
        public sweetAlertService: SweetAlertService
    ) { }

    faGreaterThan = faGreaterThan;
    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;

    bannerSwiperConfig: SwiperOptions = {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        pagination: false,
        navigation: false,
        observer: true,
        observeParents: true,
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
                slidesPerView: 3
            },
            1024: {
                slidesPerView: 4
            },
            1200: {
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

    bannerImg: any[] = [];

    comingMovieList: any[] = [];

    /**
     * on init
     */
    async ngOnInit() {
        const hotStartDate = moment().startOf("month");
        const hotEndDate = moment().endOf("month");
        const hotRes = await this.getAllMovieList(1, hotStartDate.format("YYYY-MM-DD"), hotEndDate.format("YYYY-MM-DD"));
        this.hotMovieList = hotRes.results;
        this.bannerImg = this.hotMovieList.filter((item) => item.backdrop_path !== null);

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

    /**
     * openLightbox
     * @param id id
     */
    openLightbox(id: any) {
        this.sweetAlertService.open(MovieDetailComponent, {
            data: {
                id
            }
        });
    }
}
