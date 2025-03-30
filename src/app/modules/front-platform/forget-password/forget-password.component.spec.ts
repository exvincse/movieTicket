import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { TmdbRepositoryService } from "@app/core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { of } from "rxjs";

import { ForgetPasswordComponent } from "./forget-password.component";

describe("ForgetPasswordComponent", () => {
    let component: ForgetPasswordComponent;
    let fixture: ComponentFixture<ForgetPasswordComponent>;

    const mockMovieResponse = {
        backdrop_path: "/test"
    };

    const postSendMailResponse = {
        result: true
    };

    const postValidMailResponse = null;

    const tmdbApiMock = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieDetail"]);
    const UserapiMock = jasmine.createSpyObj("UserRepositoryService", ["postSendMail", "postValidEmail"]);
    tmdbApiMock.getMovieDetail.and.returnValue(of(mockMovieResponse));
    UserapiMock.postSendMail.and.returnValue(of(postSendMailResponse));
    UserapiMock.postValidEmail.and.returnValue(of(postValidMailResponse));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ForgetPasswordComponent,
                ReactiveFormsModule
            ],
            providers: [
                { provide: TmdbRepositoryService, useValue: tmdbApiMock },
                { provide: UserRepositoryService, useValue: UserapiMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ForgetPasswordComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得api背景圖片", async () => {
        await component.ngOnInit();
        expect(tmdbApiMock.getMovieDetail).toHaveBeenCalled();
        expect(component.bgPic).toBe("/test");

        const div = fixture.debugElement.query(By.css(".l-login--register")).nativeElement;
        expect(getComputedStyle(div).backgroundImage).toBe("url(\"https://image.tmdb.org/t/p/original\")");
    });

    it("測試ngform email值", () => {
        component.forgetForm.setValue({
            email: "test@example.com"
        });

        expect(component.forgetForm.get("email")?.value).toBe("test@example.com");
    });

    it("測試ngform email值不合法驗證", () => {
        component.forgetForm.setValue({
            email: "test---++1235"
        });

        expect(component.forgetForm.get("email")?.valid).toBeFalsy();
        expect(component.forgetForm.get("email")?.hasError("pattern")).toBeTruthy();
    });

    it("測試get optemail值", () => {
        component.forgetForm.setValue({
            email: "test@yahoo.com"
        });

        expect(component.otpEmail).toBe("test@yahoo.com");
    });

    it("測試發送opt驗證信api", () => {
        component.forgetForm.setValue({
            email: "test@gmail.com"
        });

        component.validEmail();

        expect(component.userRepositoryService.postSendMail).toHaveBeenCalledOnceWith({ email: "test@gmail.com" });
        expect(component.currentStep).toBe("otp");
    });
});
