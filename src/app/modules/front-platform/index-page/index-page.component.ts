import { CommonModule } from "@angular/common";
import {
    Component, CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { SwiperOptions } from "swiper/types";

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
export class IndexPageComponent {
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
}
