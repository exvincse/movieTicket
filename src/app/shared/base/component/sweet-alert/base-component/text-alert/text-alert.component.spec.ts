import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SweetAlertConfig } from "../../sweet-alert-config";
import { TextAlertComponent } from "./text-alert.component";

describe("TextAlertComponent", () => {
    let component: TextAlertComponent;
    let fixture: ComponentFixture<TextAlertComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TextAlertComponent],
            providers: [
                { provide: SweetAlertConfig, useValue: { data: { text: "123456" } } }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TextAlertComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("元件文字呈現", () => {
        expect(component.option.data).toEqual({ text: "123456" });
    });
});
