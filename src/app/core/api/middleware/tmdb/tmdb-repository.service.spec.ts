import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { TmdbRestfulApiService } from "../../restful/tmdb-restful-api.service";
import { TmdbRepositoryService } from "./tmdb.repository.service";

describe("TmdbRepositoryService", () => {
    let service: TmdbRepositoryService;
    let mockTmdbRestfulApiService: jasmine.SpyObj<TmdbRestfulApiService>;
    const apiServiceSpy = jasmine.createSpyObj("TmdbRestfulApiService", ["get"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TmdbRepositoryService,
                { provide: TmdbRestfulApiService, useValue: apiServiceSpy }
            ]
        });

        service = TestBed.inject(TmdbRepositoryService);
        mockTmdbRestfulApiService = TestBed.inject(TmdbRestfulApiService) as jasmine.SpyObj<TmdbRestfulApiService>;
    });

    it("should be created", () => {
        // Arrange
        const mockParams = {
            page: 1,
            sort_by: "popularity.desc",
            language: "zh-TW"
        };
        const mockResponse = {
            results: [],
            total_pages: 10,
            total_results: 200
        };

        mockTmdbRestfulApiService.get.and.returnValue(of(mockResponse));

        service.getMovieList(mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });
});
