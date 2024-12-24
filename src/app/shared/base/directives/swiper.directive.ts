import {
    AfterViewInit,
    Directive, ElementRef, Input
} from "@angular/core";
import { SwiperContainer } from "swiper/element";
import { SwiperOptions } from "swiper/types";

/**
 * SwiperDirective
 */
@Directive({
    selector: "[appSwiper]",
    standalone: true
})
export class SwiperDirective implements AfterViewInit {
    @Input() swiperConfig?: SwiperOptions;

    /**
     * constructor
     * @param el SwiperContainer Element
     */
    constructor(public el: ElementRef<SwiperContainer>) { }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit(): void {
        Object.assign(this.el.nativeElement, this.swiperConfig);

        this.el.nativeElement.initialize();
    }
}
