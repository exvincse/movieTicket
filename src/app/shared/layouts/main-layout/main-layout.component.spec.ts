import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { appReducer } from "@app/store/app.reducer";
import { provideStore } from "@ngrx/store";

import { MainLayoutComponent } from "./main-layout.component";

describe("MainLayoutComponent", () => {
    let component: MainLayoutComponent;
    let fixture: ComponentFixture<MainLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MainLayoutComponent],
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting(),
                provideStore(appReducer)
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MainLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("header元件是否建立", () => {
        const header = fixture.nativeElement.querySelector("app-header");
        expect(header).toBeTruthy();
    });

    it("footer元件是否建立", () => {
        const footer = fixture.nativeElement.querySelector("app-footer");
        expect(footer).toBeTruthy();
    });
});
