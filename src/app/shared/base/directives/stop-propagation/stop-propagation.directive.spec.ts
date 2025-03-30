import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { StopPropagationDirective } from "./stop-propagation.directive";

/**
 * 測試用的假元件
 */
@Component({
    template: "<button appStopPropagation>test</button>",
    standalone: true,
    imports: [StopPropagationDirective]
})
class TestComponent { }

describe("StopPropagationDirective", () => {
    let fixture: ComponentFixture<TestComponent>;
    const clickEvent = new MouseEvent("click");

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    beforeEach(() => {
        spyOn(clickEvent, "preventDefault");
        spyOn(clickEvent, "stopPropagation");
    });

    it("掛載StopPropagationDirective", () => {
        const directiveEl = fixture.debugElement.query(By.directive(StopPropagationDirective));
        const directiveInstance = directiveEl.injector.get(StopPropagationDirective);
        expect(directiveInstance).toBeTruthy();
    });

    it("click呼叫stopPropagation和preventDefault事件", () => {
        const directiveEl = fixture.debugElement.query(By.directive(StopPropagationDirective));
        directiveEl.nativeElement.dispatchEvent(clickEvent);
        expect(clickEvent.preventDefault).toHaveBeenCalled();
        expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });
});
