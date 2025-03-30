import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { LoaderService } from "./loader.service";

describe("LoaderService", () => {
    let service: LoaderService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoaderService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("動畫次數+1", () => {
        service.startLoadingCount();
        service.loading$.subscribe((loading) => {
            expect(loading).toBeTrue();
        });
    });

    it("動畫次數 -1", fakeAsync(() => {
        service.startLoadingCount();
        tick(500);
        service.stopLoadingCount();
        tick(500);
        service.loading$.subscribe((loading) => {
            expect(loading).toBeFalse();
        });
    }));
});
