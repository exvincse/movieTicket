import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { InjectionToken } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { TmdbRestfulApiService } from "./tmdb-restful-api.service";

export const ENVIRONMENT_TMDB = new InjectionToken<EnvironmentTMDB>("environmentTMDB");

interface EnvironmentTMDB {
    production: boolean;
    apiUrl: string;
    apiKey: string;
    imgUrl: string;
    enableMocking: boolean;
}

describe("TmdbRestfulApiService", () => {
    let service: TmdbRestfulApiService;
    let httpMock: HttpTestingController;
    let environmentTMDB: EnvironmentTMDB;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TmdbRestfulApiService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
                {
                    provide: ENVIRONMENT_TMDB,
                    useValue: {
                        production: false,
                        apiUrl: "https://api.themoviedb.org/3",
                        apiKey: "your-api-key",
                        imgUrl: "",
                        enableMocking: true
                    }
                }
            ]
        });

        service = TestBed.inject(TmdbRestfulApiService);
        httpMock = TestBed.inject(HttpTestingController);

        environmentTMDB = TestBed.inject(ENVIRONMENT_TMDB);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("test get api", () => {
        const mockDate = {
            data: "test"
        };

        service.get("123").subscribe((res) => {
            expect(res).toEqual(mockDate);
        });

        const req = httpMock.expectOne(`${environmentTMDB.apiUrl}/123`);
        expect(req.request.method).toBe("GET");
        req.flush(mockDate);
    });
});
