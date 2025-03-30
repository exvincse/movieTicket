import { TestBed } from "@angular/core/testing";

import { CookieService } from "./cookie.service";

describe("CookieService", () => {
    let service: CookieService;
    const cookieService = jasmine.createSpyObj("CookieService", ["set", "get", "remove"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CookieService, useValue: cookieService }
            ]
        });
        service = TestBed.inject(CookieService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("設定 Cookie", () => {
        service.set("test", "x123456", 60);
        expect(cookieService.set).toHaveBeenCalled();
    });

    it("取得 Cookie", () => {
        service.get("x123456");
        expect(cookieService.get).toHaveBeenCalledWith("x123456");
    });

    it("移除 Cookie", () => {
        service.remove("x123456");
        expect(cookieService.remove).toHaveBeenCalledWith("x123456");
    });
});
