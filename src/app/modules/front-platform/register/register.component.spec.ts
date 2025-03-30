import {
    ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { provideRouter, Router } from "@angular/router";
import { TmdbRepositoryService } from "@app/core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { CookieService } from "@app/services/cookie/cookie.service";
import { FormValidatorService } from "@app/services/form-validator/form-validator.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of } from "rxjs";

import { RegisterComponent } from "./register.component";

describe("RegisterComponent", () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    const mockMovieResponse = {
        backdrop_path: "/test"
    };

    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["getUserProfile", "postSendMail", "postRegister"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["setUserIsLogin"]);
    const cookieService = jasmine.createSpyObj("CookieService", ["set"]);
    const tmdbRepositoryService = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieDetail"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const formValidatorService = jasmine.createSpyObj("FormValidatorService", ["emailValidator", "passwordMatchValidator"]);
    const router = jasmine.createSpyObj("Router", ["navigate"]);
    tmdbRepositoryService.getMovieDetail.and.returnValue(of(mockMovieResponse));
    userRepositoryService.postSendMail.and.returnValue(of({ result: true }));
    formValidatorService.emailValidator.and.returnValue(() => of(null));
    formValidatorService.passwordMatchValidator.and.returnValue(() => null);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RegisterComponent,
                ReactiveFormsModule
            ],
            providers: [
                provideRouter([]),
                { provide: TmdbRepositoryService, useValue: tmdbRepositoryService },
                { provide: UserRepositoryService, useValue: userRepositoryService },
                { provide: UserStoreService, useValue: userStoreService },
                { provide: CookieService, useValue: cookieService },
                { provide: SweetAlertService, useValue: sweetAlertService },
                { provide: FormValidatorService, useValue: formValidatorService },
                { provide: Router, useValue: router }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得背景圖片", fakeAsync(() => {
        component.ngOnInit();
        tick();
        expect(component.bgPic).toBe("/test");
    }));

    it("ngform驗證email", () => {
        const emailControl = component.registerForm.get("email");
        emailControl?.setValue("123456789@gmail.com");

        expect(emailControl?.hasError("required")).toBe(false);
        expect(emailControl?.hasError("pattern")).toBe(false);
        expect(formValidatorService.emailValidator).toHaveBeenCalled();
    });

    it("ngform驗證密碼", () => {
        const passwordContral = component.registerForm.get("password");
        passwordContral?.setValue("1234567891");

        expect(passwordContral?.valid).toBe(true);
        expect(passwordContral?.hasError("minlength")).toBe(false);
    });

    it("發送mail api", () => {
        component.registerForm.setValue({
            email: "xxxxx@gmail.com",
            password: "12345678",
            checkPassword: "12345678"
        });

        component.registerEmail();
        expect(component.userRepositoryService.postSendMail).toHaveBeenCalledWith({ email: "xxxxx@gmail.com" });
        expect(component.currentStep).toBe("otp");
    });

    it("驗證otp", () => {
        userRepositoryService.postRegister.and.returnValue(of({ result: { accessToken: "123456" } }));
        sweetAlertService.open.and.returnValue({
            instance: {
                afterClose: of(null)
            }
        });

        component.registerForm.setValue({
            email: "xxxxx@gmail.com",
            password: "12345678",
            checkPassword: "12345678"
        });

        component.emitValidOtp();

        const ref = component.sweetAlertService.open(TextAlertComponent, {
            icon: "success",
            data: { text: "註冊成功" }
        });

        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "success",
            data: { text: "註冊成功" }
        });

        ref.instance.afterClose.subscribe(() => {
            expect(cookieService.set).toHaveBeenCalled();
            expect(userStoreService.setUserIsLogin).toHaveBeenCalled();
            expect(userRepositoryService.getUserProfile).toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(["/"]);
        });
    });
});
