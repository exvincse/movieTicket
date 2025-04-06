import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { CookieService } from "@app/services/cookie/cookie.service";
import { LoaderService } from "@app/services/loader/loader.service";
import { ENVIRONMENT } from "src/environments/environment-token";

import { RequestInterceptor } from "./request-interceptor";

describe("RequestInterceptor", () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;

    const loaderService = jasmine.createSpyObj("LoaderService", ["startLoadingCount"]);
    const cookiesService = jasmine.createSpyObj("LoaderService", ["get"]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([RequestInterceptor])),
                provideHttpClientTesting(),
                { provide: LoaderService, useValue: loaderService },
                { provide: CookieService, useValue: cookiesService },
                {
                    provide: ENVIRONMENT,
                    useValue: {
                        apiKey: "test-api-key",
                        production: false,
                        azureSubKey: ""
                    }
                }
            ],
        });
    });

    it("第三方電影api不帶上token", () => {
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);

        cookiesService.get.and.returnValue("textToken");

        http.get("/themoviedb/test").subscribe();

        const req = httpMock.expectOne("/themoviedb/test");
        expect(req.request.headers.has("Authorization")).toBeTrue();
        expect(loaderService.startLoadingCount).toHaveBeenCalled();
    });

    it("除第三方api其他都帶上token", () => {
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);

        cookiesService.get.and.returnValue("textToken");

        http.get("/test").subscribe();

        const req = httpMock.expectOne("/test");
        expect(req.request.headers.has("Authorization")).toBeTrue();
        expect(req.request.headers.get("Authorization")).toBe("Bearer textToken");
        expect(loaderService.startLoadingCount).toHaveBeenCalled();
    });

    it("佈署azure帶上Ocp-Apim-Subscription-Key", () => {
        // 覆蓋環境變數設定
        TestBed.overrideProvider(ENVIRONMENT, {
            useValue: {
                production: true,
                apiUrl: "https://prod-api.com",
                azureSubKey: "prod-key"
            },
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);

        cookiesService.get.and.returnValue("textToken");

        http.get("/test").subscribe();

        const req = httpMock.expectOne("/test");
        expect(req.request.headers.has("Ocp-Apim-Subscription-Key")).toBeTrue();
        expect(req.request.headers.get("Ocp-Apim-Subscription-Key")).toBe("prod-key");
        expect(loaderService.startLoadingCount).toHaveBeenCalled();
    });
});
