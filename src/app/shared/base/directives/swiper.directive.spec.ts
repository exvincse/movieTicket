import { ElementRef } from "@angular/core";
import { SwiperContainer } from "swiper/element";
import { SwiperOptions } from "swiper/types";

import { SwiperDirective } from "./swiper.directive";

describe("SwiperDirective", () => {
    let directive: SwiperDirective;
    let elementRefMock: ElementRef<SwiperContainer>;
    let swiperElementMock: Partial<SwiperContainer>;

    beforeEach(() => {
        // Create a mock SwiperContainer
        swiperElementMock = {
            initialize: jasmine.createSpy("initialize"),
            setAttribute: jasmine.createSpy("setAttribute")
        };

        // Create a mock ElementRef
        elementRefMock = {
            nativeElement: swiperElementMock as SwiperContainer
        } as ElementRef<SwiperContainer>;

        // Create the directive instance
        directive = new SwiperDirective(elementRefMock);
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    describe("ngOnInit", () => {
        it("should assign config to native element", () => {
            const testConfig: SwiperOptions = {
                slidesPerView: 2,
                spaceBetween: 10,
                navigation: true
            };

            directive.swiperConfig = testConfig;
            directive.ngAfterViewInit();

            // Check that the config was assigned to the native element
            expect(elementRefMock.nativeElement).toEqual(jasmine.objectContaining(testConfig));
        });

        it("should call initialize on the native element", () => {
            directive.ngAfterViewInit();

            // Verify that initialize was called
            expect(swiperElementMock.initialize).toHaveBeenCalled();
        });

        it("should work with undefined config", () => {
            directive.swiperConfig = undefined;

            // Should not throw an error
            expect(() => directive.ngAfterViewInit()).not.toThrow();
        });

        it("should merge config correctly", () => {
            const initialConfig: SwiperOptions = {
                slidesPerView: 1,
                spaceBetween: 5
            };

            const additionalConfig: SwiperOptions = {
                navigation: true,
                pagination: { clickable: true }
            };

            directive.swiperConfig = { ...initialConfig, ...additionalConfig };
            directive.ngAfterViewInit();

            // Check that both initial and additional configs are present
            expect(elementRefMock.nativeElement).toEqual(jasmine.objectContaining({
                slidesPerView: 1,
                spaceBetween: 5,
                navigation: true,
                pagination: { clickable: true }
            }));
        });
    });
});
