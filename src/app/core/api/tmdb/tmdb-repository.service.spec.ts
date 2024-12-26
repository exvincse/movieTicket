import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";

import { TmdbApiService } from "../TMDBApiService.service";
import { TmdbRepositoryService } from "./tmdb.repository.service";

describe("TmdbRepositoryService", () => {
    let service: TmdbRepositoryService;
    let mockTmdbApiService: jasmine.SpyObj<TmdbApiService>;
    const apiServiceSpy = jasmine.createSpyObj("TmdbApiService", ["get"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TmdbRepositoryService,
                { provide: TmdbApiService, useValue: apiServiceSpy }
            ]
        });

        service = TestBed.inject(TmdbRepositoryService);
        mockTmdbApiService = TestBed.inject(TmdbApiService) as jasmine.SpyObj<TmdbApiService>;
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

        mockTmdbApiService.get.and.returnValue(of(mockResponse));

        service.getMovieList(mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });
});
