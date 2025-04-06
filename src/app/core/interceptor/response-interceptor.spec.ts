import {
    HttpClient, HttpErrorResponse, HttpResponse, provideHttpClient, withInterceptors
} from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { CookieService } from "@app/services/cookie/cookie.service";
import { LoaderService } from "@app/services/loader/loader.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of, Subject, throwError } from "rxjs";

import { UserRepositoryService } from "../api/middleware/user/user-repository.service";
import { ResponseInterceptor } from "./response-interceptor";

describe("RequestInterceptor", () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["getReFreshToken"]);
    const cookiesService = jasmine.createSpyObj("CookieService", ["set"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["setClearUserData", "setUserIsLogin", "setUserIsLogin"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const loaderService = jasmine.createSpyObj("LoaderService", ["stopLoadingCount"]);
    const router = jasmine.createSpyObj("Router", ["navigate"]);
    const sweetAlertMock = {
        instance: {
            afterClose: new Subject()
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([ResponseInterceptor])),
                provideHttpClientTesting(),
                { provide: UserRepositoryService, useValue: userRepositoryService },
                { provide: CookieService, useValue: cookiesService },
                { provide: UserStoreService, useValue: userStoreService },
                { provide: SweetAlertService, useValue: sweetAlertService },
                { provide: LoaderService, useValue: loaderService },
                { provide: Router, useValue: router }
            ],
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("第三方電影api", () => {
        http.get("/themoviedb").subscribe();
        const req = httpMock.expectOne("/themoviedb");
        expect(req.request.urlWithParams).toBe("/themoviedb");
        req.flush({});
        expect(loaderService.stopLoadingCount).toHaveBeenCalled();
        // 觸發api loading動畫
        expect(loaderService.stopLoadingCount).toHaveBeenCalled();
    });

    it("沒登入清除使用者", () => {
        const mockResponse = new HttpResponse({
            status: 200,
            body: { result: false },
            url: "/GetIsCheckLogin"
        });

        http.get("/GetIsCheckLogin").subscribe();

        const req = httpMock.expectOne("/GetIsCheckLogin");
        expect(req.request.urlWithParams).toBe("/GetIsCheckLogin");

        req.flush(mockResponse.body);
        httpMock.verify();

        expect(userStoreService.setClearUserData).toHaveBeenCalled();
        expect(userStoreService.setUserIsLogin).toHaveBeenCalledWith(false);
    });

    it("401錯誤更新token成功並重新發送請求", () => {
        userRepositoryService.getReFreshToken.and.returnValue(of({ result: { accessToken: "test" } }));

        http.get("/test").subscribe({
            /**
             * next
             * @returns fail
             */
            next: () => fail("應該進入 error"),
            /**
             * error
             * @param error error
             */
            error: (error: HttpErrorResponse) => {
                expect(error.status).toBe(401);
            }
        });

        const req = httpMock.expectOne("/test");
        req.flush({ result: { isReNewToken: true } }, { status: 401, statusText: "Unauthorized" });

        expect(userRepositoryService.getReFreshToken).toHaveBeenCalled();
        expect(userStoreService.setUserIsLogin).toHaveBeenCalledWith(true);
        expect(cookiesService.set).toHaveBeenCalledWith("accessToken", "test", 60);

        // 換發後重新發送api
        const req2 = httpMock.expectOne("/test");

        expect(req2.request.headers.has("Authorization")).toBeTrue();
        expect(req2.request.headers.get("Authorization")).toBe("Bearer test");

        // 觸發api loading動畫
        expect(loaderService.stopLoadingCount).toHaveBeenCalled();

        httpMock.verify();
    });

    it("401錯誤更新token失敗", () => {
        sweetAlertService.open.and.returnValue(sweetAlertMock);
        userRepositoryService.getReFreshToken.and.returnValue(throwError(() => new Error("Token 刷新失敗")));

        http.get("/test").subscribe({
            /**
             * error
             * @param error error
             */
            error: (error: HttpErrorResponse) => {
                expect(error.message).toBe("Token 刷新失敗");
            }
        });

        const req = httpMock.expectOne("/test");
        req.flush({ result: { isReNewToken: true } }, { status: 401, statusText: "Unauthorized" });

        expect(userRepositoryService.getReFreshToken).toHaveBeenCalled();
        expect(userStoreService.setClearUserData).toHaveBeenCalled();
        expect(userStoreService.setUserIsLogin).toHaveBeenCalledWith(false);
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "error",
            data: {
                text: "登入已逾時，請重新登入"
            }
        });

        sweetAlertMock.instance.afterClose.subscribe(() => {
            expect(router.navigate).toHaveBeenCalledOnceWith(["/"]);
        });

        // 觸發api loading動畫
        expect(loaderService.stopLoadingCount).toHaveBeenCalled();

        httpMock.verify();
    });

    it("錯誤並重新登入", () => {
        sweetAlertService.open.and.returnValue(sweetAlertMock);
        http.get("/test").subscribe({
            /**
             * error
             */
            error: () => { }
        });

        const req = httpMock.expectOne("/test");
        req.flush({ result: { isRepeatLogin: true } }, { status: 401, statusText: "Unauthorized" });

        expect(userStoreService.setClearUserData).toHaveBeenCalled();
        expect(userStoreService.setUserIsLogin).toHaveBeenCalledWith(false);
        expect(sweetAlertService.open).toHaveBeenCalledWith(TextAlertComponent, {
            icon: "error",
            data: {
                text: "登入已逾時，請重新登入"
            }
        });

        sweetAlertMock.instance.afterClose.subscribe(() => {
            expect(router.navigate).toHaveBeenCalledOnceWith(["/"]);
        });

        // 觸發api loading動畫
        expect(loaderService.stopLoadingCount).toHaveBeenCalled();

        httpMock.verify();
    });
});
