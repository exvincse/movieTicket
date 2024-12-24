import { CommonModule } from "@angular/common";
import {
    Component, CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGreaterThan } from "@fortawesome/free-solid-svg-icons";
import { SwiperOptions } from "swiper/types";

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
export class IssueTicketComponent {
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
}
