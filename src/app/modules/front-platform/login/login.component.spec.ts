import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { TmdbRepositoryService } from "@app/core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { CookieService } from "@app/services/cookie/cookie.service";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of } from "rxjs";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    const mockMovieResponse = {
        backdrop_path: "/test"
    };

    const UserapiMock = jasmine.createSpyObj("UserRepositoryService", ["postLogin", "getUserProfile"]);
    const UsetStoreApiMock = jasmine.createSpyObj("UserStoreService", ["setUserIsLogin"]);
    const cookieServiceMock = jasmine.createSpyObj("CookieService", ["set"]);
    const tmdbApiMock = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieDetail"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    tmdbApiMock.getMovieDetail.and.returnValue(of(mockMovieResponse));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                ReactiveFormsModule
            ],
            providers: [
                provideRouter([]),
                { provide: TmdbRepositoryService, useValue: tmdbApiMock },
                { provide: UserRepositoryService, useValue: UserapiMock },
                { provide: UserStoreService, useValue: UsetStoreApiMock },
                { provide: CookieService, useValue: cookieServiceMock },
                { provide: SweetAlertService, useValue: sweetAlertService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("測試背景圖片api", async () => {
        await component.ngOnInit();
        expect(component.bgPic).toBe("/test");
        const div = fixture.debugElement.query(By.css(".l-login")).nativeElement;
        expect(getComputedStyle(div).backgroundImage).toBe("url(\"https://image.tmdb.org/t/p/original\")");
    });

    it("驗證ngform email錯誤值", () => {
        const emailContral = component.loginForm.get("email");
        emailContral?.setValue("textfdsfds-fsdfdsf");

        expect(emailContral?.valid).toBeFalsy();
        expect(emailContral?.hasError("pattern")).toBeTruthy();
    });

    it("驗證ngform email正確值", () => {
        const emailContral = component.loginForm.get("email");
        emailContral?.setValue("text@gmail.com");

        expect(emailContral?.valid).toBeTruthy();
        expect(emailContral?.hasError("pattern")).toBeFalsy();
    });

    it("驗證ngform password錯誤值", () => {
        const emailContral = component.loginForm.get("password");
        emailContral?.setValue("textfdsfds-fsdfdsf");

        expect(emailContral?.valid).toBeTruthy();
        expect(emailContral?.hasError("minlength")).toBeFalsy();
    });

    it("驗證ngform password正確值", () => {
        const passwordContral = component.loginForm.get("password");
        passwordContral?.setValue("1234567");

        expect(passwordContral?.valid).toBeFalsy();
        expect(passwordContral?.hasError("minlength")).toBeTruthy();
    });

    it("驗證登入成功狀態", () => {
        UserapiMock.postLogin.and.returnValue(of({
            result: {
                accessToken: "xxxx"
            }
        }));
        const routerSpy = spyOn(component.router, "navigate");
        component.loginForm.setValue({
            email: "123456@gmail.com",
            password: "12345678"
        });

        component.login();
        expect(component.userRepositoryService.postLogin).toHaveBeenCalled();
        expect(component.userRepositoryService.getUserProfile).toHaveBeenCalled();
        expect(component.userStoreService.setUserIsLogin).toHaveBeenCalledOnceWith(true);
        expect(component.cookieService.set).toHaveBeenCalledWith("accessToken", "xxxx", 60);
        expect(routerSpy).toHaveBeenCalledWith(["/"]);
    });

    it("驗證登入失敗狀態", () => {
        UserapiMock.postLogin.and.returnValue(of({
            result: {
                accessToken: ""
            }
        }));

        component.loginForm.setValue({
            email: "123456@gmail.com",
            password: "12345678"
        });

        component.login();

        expect(component.sweetAlertService.open).toHaveBeenCalled();
    });
});
