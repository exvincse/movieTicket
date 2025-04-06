import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { environmentTMDB } from "src/environments/environment";

import { TmdbRestfulApiService } from "./tmdb-restful-api.service";

describe("TmdbRestfulApiService", () => {
    let service: TmdbRestfulApiService;

    const mockParam = {
        test: ""
    };

    const mockResponse = {
        data: "test"
    };

    const httpClientMock = jasmine.createSpyObj("HttpClient", ["get", "post", "put"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClient, useValue: httpClientMock }
            ]
        });

        service = TestBed.inject(TmdbRestfulApiService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("測試get方法", () => {
        httpClientMock.get.and.returnValue(of(mockResponse));

        service.get("123").subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        expect(httpClientMock.get).toHaveBeenCalledWith(`${environmentTMDB.apiUrl}/123`);
    });

    it("測試post方法", () => {
        httpClientMock.post.and.returnValue(of(mockResponse));

        service.post("123", mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        expect(httpClientMock.post).toHaveBeenCalledWith(`${environmentTMDB.apiUrl}/123`, mockParam);
    });

    it("測試put方法", () => {
        httpClientMock.put.and.returnValue(of(mockResponse));

        service.put("123", mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        expect(httpClientMock.put).toHaveBeenCalledWith(`${environmentTMDB.apiUrl}/123`, mockParam);
    });
});
