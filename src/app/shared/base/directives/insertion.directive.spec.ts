import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { InsertionDirective } from "./insertion.directive";

/**
 * 測試用的假元件
 */
@Component({
    template: "<button appInsertion>test</button>",
    standalone: true,
    imports: [InsertionDirective]
})
class TestComponent { }

describe("InsertionDirective", () => {
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it("掛載InsertionDirective", () => {
        const directiveEl = fixture.debugElement.query(By.directive(InsertionDirective));
        const directiveInstance = directiveEl.injector.get(InsertionDirective);
        expect(directiveInstance).toBeTruthy();
        expect(directiveInstance.viewContainerRef).toBeTruthy();
    });
});
