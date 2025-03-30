import {
    Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement,
    ElementRef
} from "@angular/core";
import {
    ComponentFixture, TestBed
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SwiperContainer } from "swiper/element";
import { SwiperOptions } from "swiper/types";

import { SwiperDirective } from "./swiper.directive";

/**
 * 測試用的假元件
 */
@Component({
    template: `
        <swiper-container [swiperConfig]="swiperConfig" appSwiper init="false" class="swiper-container">
            <swiper-slide>
            </swiper-slide>
        </swiper-container>
    `,
    standalone: true,
    imports: [SwiperDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
class TestComponent {
    swiperConfig: SwiperOptions = {
        loop: true,
        pagination: false,
        navigation: false,
    };
}

describe("SwiperDirective", () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let directiveEl: DebugElement = {} as DebugElement;
    let directiveInstance: SwiperDirective = {} as SwiperDirective;

    const swiperMock = {
        nativeElement: {
            initialize: jasmine.createSpy("initialize")
        }
    } as unknown as ElementRef<SwiperContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;

        directiveEl = fixture.debugElement.query(By.directive(SwiperDirective));
        directiveInstance = directiveEl.injector.get(SwiperDirective);
        directiveInstance.el = swiperMock;

        fixture.detectChanges();
    });

    it("掛載SwiperDirective", () => {
        expect(directiveInstance).toBeTruthy();
    });

    it("掛載swiperConfig", () => {
        expect(directiveInstance.swiperConfig).toEqual(component.swiperConfig);
    });
});
