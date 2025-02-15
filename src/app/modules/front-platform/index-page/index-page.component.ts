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

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { GlightboxComponent } from "../../../shared/base/component/glightbox/glightbox.component";
import { GlightboxService } from "../../../shared/base/component/glightbox/service/glightbox.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";

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
     * @param glightboxService glightboxService
     */
    constructor(
        public tmdbRepositoryService: TmdbRepositoryService,
        public glightboxService: GlightboxService
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

    /**
     * openLightbox
     * @param url url
     */
    openLightbox(url: string): void {
        this.glightboxService.open(GlightboxComponent, { url });
        // const ref = this.glightboxService.open(GlightboxComponent, { url });
        // ref.instance.afterClose.subscribe((res: any) => {
        //     console.log(res);
        // });
    }
}
