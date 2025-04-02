import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { environment } from "src/environments/environment";

import { RestfulApiService } from "./restful-api.service";

describe("RestfulApiService", () => {
    let service: RestfulApiService;

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

        service = TestBed.inject(RestfulApiService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("測試get方法", () => {
        httpClientMock.get.and.returnValue(of(mockResponse));

        service.get("123").subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/123`);
    });

    it("測試post方法", () => {
        httpClientMock.post.and.returnValue(of(mockResponse));

        service.post("123", mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        expect(httpClientMock.post).toHaveBeenCalledWith(`${environment.apiUrl}/123`, mockParam);
    });

    it("測試put方法", () => {
        httpClientMock.put.and.returnValue(of(mockResponse));

        service.put("123", mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        expect(httpClientMock.put).toHaveBeenCalledWith(`${environment.apiUrl}/123`, mockParam);
    });
});
