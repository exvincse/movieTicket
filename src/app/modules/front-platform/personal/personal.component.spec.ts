import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { SwiperDirective } from "@app/shared/base/directives/swiper/swiper.directive";
import { UserStoreService } from "@app/store/user/service/user-store.service";

import { PersonalComponent } from "./personal.component";

describe("PersonalComponent", () => {
    let component: PersonalComponent;
    let fixture: ComponentFixture<PersonalComponent>;

    const userStoreServiceMock = jasmine.createSpyObj("userStoreService", ["getUserData"]);
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PersonalComponent],
            providers: [
                provideRouter([]),
                { provide: UserStoreService, useValue: userStoreServiceMock }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PersonalComponent);
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
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("去除路由參數", () => {
        component.router = {
            url: "/personal?test=123"
        } as any;
        expect(component.noParamsRouter).toBe("/personal");
    });

    it("掛載畫面上Swiper", () => {
        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.ngAfterViewInit();
        expect(swiperElement.el.nativeElement.initialize).toHaveBeenCalled();
    });
});
