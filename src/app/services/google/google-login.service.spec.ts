import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of } from "rxjs";

import { CookieService } from "../cookie/cookie.service";
import { GOOGLE, GoogleLoginService } from "./google-login.service";

describe("GoogleLoginService", () => {
    let service: GoogleLoginService;
    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["postGoogleLogin"]);
    const cookieService = jasmine.createSpyObj("CookieService", ["set"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["setUserIsLogin"]);
    const router = jasmine.createSpyObj("Router", ["navigate"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const google = {
        accounts: {
            id: {
                initialize: jasmine.createSpy("initialize"),
                renderButton: jasmine.createSpy("renderButton")
            }
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: UserRepositoryService, useValue: userRepositoryService },
                { provide: CookieService, useValue: cookieService },
                { provide: UserStoreService, useValue: userStoreService },
                { provide: Router, useValue: router },
                { provide: SweetAlertService, useValue: sweetAlertService },
                { provide: GOOGLE, useValue: google }
            ]
        });
        service = TestBed.inject(GoogleLoginService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("載入google btn", () => {
        service.loadGoogleAuth();
        expect(google.accounts.id.initialize).toHaveBeenCalled();
        expect(service).toBeTruthy();
    });

    it("登入回傳google token成功", () => {
        userRepositoryService.postGoogleLogin.and.returnValue(of({ result: { accessToken: "test1" } }));
        service.handleResponse({ credential: "test" });
        expect(userRepositoryService.postGoogleLogin).toHaveBeenCalledWith({ googleToken: "test" });
        expect(cookieService.set).toHaveBeenCalledWith("accessToken", "test1", 60);
        expect(userStoreService.setUserIsLogin).toHaveBeenCalledWith(true);
        expect(router.navigate).toHaveBeenCalledWith(["/"]);
    });

    it("登入回傳google token失敗", () => {
        service.handleResponse({ credential: "" });
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "error",
            data: {
                text: "登入失敗"
            }
        });
    });

    it("登入失敗", () => {
        userRepositoryService.postGoogleLogin.and.returnValue(of({ result: { accessToken: "" } }));
        service.handleResponse({ credential: "test" });
        expect(userRepositoryService.postGoogleLogin).toHaveBeenCalledWith({ googleToken: "test" });
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "error",
            data: {
                text: "登入失敗"
            }
        });
    });
});
