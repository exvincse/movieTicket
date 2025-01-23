import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GlightboxComponent } from "./glightbox.component";

describe("GlightboxComponent", () => {
    let component: GlightboxComponent;
    let fixture: ComponentFixture<GlightboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GlightboxComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GlightboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
