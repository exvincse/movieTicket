import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PagerComponent } from "./pager.component";

describe("PagerComponent", () => {
    let component: PagerComponent;
    let fixture: ComponentFixture<PagerComponent>;
    const changePageEmitter = jasmine.createSpyObj("EventEmitter", ["emit"]);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PagerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PagerComponent);
        component = fixture.componentInstance;
        component.changePageEmitter = changePageEmitter;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得頁數", () => {
        component.total = 10;
        expect(component.total).toBe(10);
    });

    it("取得要呈現的頁碼", () => {
        component.total = 100;
        component.nowPage = 5;
        expect(component.nowPage).toBe(5);
        expect(component.renderPages).toEqual([3, 4, 5, 6, 7]);
    });

    it("改變頁碼", () => {
        component.total = 100;
        component.nowPage = 5;
        component.changePage(6);
        expect(component.nowPage).toBe(6);
        expect(component.renderPages).toEqual([4, 5, 6, 7, 8]);
    });
});
