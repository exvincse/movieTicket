import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray } from "@angular/forms";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";

import { OtpValidComponent } from "./otp-valid.component";

describe("OtpValidComponent", () => {
    let component: OtpValidComponent;
    let fixture: ComponentFixture<OtpValidComponent>;

    const userApiMock = jasmine.createSpyObj("UserRepositoryService", ["postValidOtp"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OtpValidComponent],
            providers: [
                { provide: UserRepositoryService, useValue: userApiMock },
                { provide: SweetAlertService, useValue: sweetAlertService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OtpValidComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("otpForm應該包含6個FormControl", () => {
        const otpArray = component.otpForm.get("otp") as FormArray;
        expect(otpArray.controls.length).toBe(6);
    });

    it("set與get otp值", () => {
        const otpArray = component.otpForm.get("otp") as FormArray;
        const otpTest = ["1", "2", "3", "4", "5", "6"];
        otpArray.controls.forEach((item, index) => {
            item.setValue(otpTest[index]);
        });
        expect(component.otpForm.get("otp")?.value).toEqual(otpTest);
    });

    it("email隱藏@前帳號中間4碼", () => {
        component.otpEmail = "123456789@gmail.com";
        expect(component.maskEmail).toBe("12****789@gmail.com");
    });

    it("手動輸入過濾input非數字字元", () => {
        const div = fixture.nativeElement.querySelectorAll(".o-inputbox--otp");
        div[0].value = "test1";
        div[0].dispatchEvent(new Event("input"));
        expect(div[0].value).toBe("1");
    });

    it("手動輸入第一input後focus下一個input", () => {
        const div = fixture.nativeElement.querySelectorAll(".o-inputbox--otp");
        spyOn(div[1], "focus");
        div[0].value = "2";
        div[0].dispatchEvent(new Event("input"));
        expect(div[1].focus).toHaveBeenCalled();
    });

    it("手動輸入最後一個input後移除focus", () => {
        const div = fixture.nativeElement.querySelectorAll(".o-inputbox--otp");
        spyOn(div[5], "focus");
        div[5].value = "2";
        div[5].dispatchEvent(new Event("input"));
        expect(div[5].focus).not.toHaveBeenCalled();
    });

    it("手動back space", () => {
        const div = fixture.nativeElement.querySelectorAll(".o-inputbox--otp");
        spyOn(div[4], "focus");
        div[5].value = "";
        div[5].dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace" }));
        expect(div[4].focus).toHaveBeenCalled();
    });
});
