import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { SwiperOptions } from "swiper/types";

import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";

/**
 * PersonalComponent
 */
@Component({
    selector: "app-personal",
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterModule, SwiperDirective],
    templateUrl: "./personal.component.html",
    styleUrl: "./personal.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PersonalComponent {
    /**
     * constructor
     * @param router Router
     */
    constructor(public router: Router) { }

    path = [
        {
            name: "個人資料",
            link: "/personal/base"
        },
        {
            name: "票卷管理",
            link: "/personal/ticket"
        }
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
}
