import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";
import { IndexPageComponent } from "./index-page.component";

describe("IndexPageComponent", () => {
    let component: IndexPageComponent;
    let fixture: ComponentFixture<IndexPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                IndexPageComponent, // Import the standalone component directly
            ],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(IndexPageComponent);
        component = fixture.componentInstance;

        const swiperElement = fixture.debugElement.queryAll(By.directive(SwiperDirective));
        swiperElement.forEach((item) => {
            const swiperItem = item.injector.get(SwiperDirective);
            swiperItem.el = {
                nativeElement: {
                    initialize: jasmine.createSpy("initialize")
                } as any
            };
        });

        fixture.detectChanges(); // Trigger change detection
    });

    it("should create the component", () => {
        expect(component).toBeTruthy();
    });

    it("should call initialize on SwiperDirective", () => {
        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.ngAfterViewInit();
        expect(swiperElement.el.nativeElement.initialize).toHaveBeenCalled();
    });
});
