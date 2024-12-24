import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper.directive";
import { IssueTicketComponent } from "./issue-ticket.component";

describe("IssueTicketComponent", () => {
    let component: IssueTicketComponent;
    let fixture: ComponentFixture<IssueTicketComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IssueTicketComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IssueTicketComponent);
        component = fixture.componentInstance;

        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.el = {
            nativeElement: {
                initialize: jasmine.createSpy("initialize")
            } as any
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("swiper是否被呼叫", () => {
        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.ngAfterViewInit();
        expect(swiperElement.el.nativeElement.initialize).toHaveBeenCalled();
    });

    it("連結事件是否被註銷", () => {
        const clickableEl = fixture.debugElement.query(By.directive(StopPropagationDirective));
        const directiveInstance = clickableEl.injector.get(StopPropagationDirective);
        const onClickSpy = spyOn(directiveInstance, "onClick");

        const event = new Event("click");
        clickableEl.nativeElement.dispatchEvent(event);

        expect(onClickSpy).toHaveBeenCalled();
    });
});
