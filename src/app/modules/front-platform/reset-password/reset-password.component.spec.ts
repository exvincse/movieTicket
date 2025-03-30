import {
    ComponentFixture, TestBed
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { provideRouter, Router } from "@angular/router";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { FormValidatorService } from "@app/services/form-validator/form-validator.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { of, Subject } from "rxjs";

import { ResetPasswordComponent } from "./reset-password.component";

describe("ResetPasswordComponent", () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;

    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["getUserProfile", "putResetPassword"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const formValidatorService = jasmine.createSpyObj("FormValidatorService", ["passwordMatchValidator"]);
    const router = jasmine.createSpyObj("Router", ["navigate"]);
    const refMock = {
        instance: {
            afterClose: new Subject<void>()
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ResetPasswordComponent,
                ReactiveFormsModule
            ],
            providers: [
                provideRouter([]),
                { provide: UserRepositoryService, useValue: userRepositoryService },
                { provide: SweetAlertService, useValue: sweetAlertService },
                { provide: FormValidatorService, useValue: formValidatorService },
                { provide: Router, useValue: router }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        refMock.instance.afterClose = new Subject<void>();
        formValidatorService.passwordMatchValidator.and.returnValue(() => null);
        sweetAlertService.open.and.returnValue(refMock);

        userRepositoryService.putResetPassword.calls.reset();
        sweetAlertService.open.calls.reset();
        router.navigate.calls.reset();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("驗證 ngForm 密碼正確", () => {
        component.registerForm.setValue({
            password: "123456789",
            checkPassword: "123456789"
        });

        expect(component.registerForm.get("password")?.valid).toBeTrue();
        expect(component.registerForm.get("checkPassword")?.valid).toBeTrue();
    });

    it("驗證 ngForm 密碼失敗", () => {
        component.registerForm.setValue({
            password: "123456",
            checkPassword: "123456789"
        });

        expect(component.registerForm.get("password")?.valid).toBeFalse();
        expect(component.registerForm.get("checkPassword")?.valid).toBeTrue();
    });

    it("驗證修改密碼 API 成功", () => {
        userRepositoryService.putResetPassword.and.returnValue(of({
            message: "修改成功",
            result: true
        }));

        component.otpEmail = "xxxx@gmail.com";
        component.registerForm.setValue({
            password: "123456789",
            checkPassword: "123456789"
        });

        component.resetPassword();

        expect(userRepositoryService.putResetPassword).toHaveBeenCalled();
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "success",
            data: {
                text: "修改成功"
            }
        });

        sweetAlertService.open.calls.mostRecent().returnValue.instance.afterClose.next();

        expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("驗證修改密碼 API 失敗", () => {
        userRepositoryService.putResetPassword.and.returnValue(of({
            message: "修改失敗",
            result: false
        }));

        component.otpEmail = "xxxx@gmail.com";
        component.registerForm.setValue({
            password: "123456789",
            checkPassword: "123456789"
        });

        component.resetPassword();

        expect(userRepositoryService.putResetPassword).toHaveBeenCalled();
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "error",
            data: {
                text: "修改失敗"
            }
        });

        sweetAlertService.open.calls.mostRecent().returnValue.instance.afterClose.next();

        expect(router.navigate).not.toHaveBeenCalled();
    });
});
