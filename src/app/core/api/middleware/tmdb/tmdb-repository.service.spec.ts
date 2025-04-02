import { TestBed } from "@angular/core/testing";
import { MovieCreditsOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-credits-output.model";
import { MovieDetailOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-detail-output.model";
import { MovieGenreOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-genre-output.model";
import { MovieListOutputModel } from "@app/core/models/outputViewModels/movie/movie-list-output.model";
import { MovieReleaseDateOutputModelEntity } from "@app/core/models/outputViewModels/movie/movie-release-date-output.model";
import { of } from "rxjs";

import { TmdbRestfulApiService } from "../../restful/tmdb-restful-api.service";
import { TmdbRepositoryService } from "./tmdb-repository.service";

describe("TmdbRepositoryService", () => {
    let service: TmdbRepositoryService;
    let mockTmdbRestfulApiService: jasmine.SpyObj<TmdbRestfulApiService>;
    const tmdbRestfulApiService = jasmine.createSpyObj("TmdbRestfulApiService", ["get"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TmdbRepositoryService,
                { provide: TmdbRestfulApiService, useValue: tmdbRestfulApiService }
            ]
        });

        service = TestBed.inject(TmdbRepositoryService);
        mockTmdbRestfulApiService = TestBed.inject(TmdbRestfulApiService) as jasmine.SpyObj<TmdbRestfulApiService>;
    });

    it("取得電影列表", () => {
        const mockParams = {
            language: "zh-TW"
        };
        const mockResponse: MovieListOutputModel = {
            page: 0,
            total_pages: 0,
            total_results: 0,
            results: [
                {
                    adult: false,
                    backdrop_path: "",
                    genre_ids: [],
                    id: 0,
                    original_language: "",
                    original_title: "",
                    overview: "",
                    popularity: 0,
                    poster_path: "",
                    release_date: "",
                    title: "",
                    video: false,
                    vote_average: 0,
                    vote_count: 0
                }
            ]
        };

        mockTmdbRestfulApiService.get.and.returnValue(of(mockResponse));

        service.getMovieList(mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得電影合併資料", () => {
        const mockParams = {
            language: "zh-TW"
        };

        const list: MovieDetailOutputModelEntity = {
            adult: false,
            backdrop_path: "",
            belongs_to_collection: "",
            budget: 0,
            genres: [],
            homepage: "",
            id: 0,
            imdb_id: "",
            origin_country: [],
            original_language: "",
            original_title: "",
            overview: "",
            popularity: 0,
            poster_path: "",
            production_companies: [],
            production_countries: [],
            release_date: "",
            revenue: 0,
            runtime: 0,
            spoken_languages: [],
            status: "",
            tagline: "",
            title: "",
            video: false,
            vote_average: 0,
            vote_count: 0
        };

        const credits: MovieCreditsOutputModelEntity = {
            id: 0,
            cast: [
                {
                    adult: 0,
                    gender: 0,
                    id: 0,
                    known_for_department: "",
                    name: "",
                    original_name: "",
                    popularity: 0,
                    profile_path: "",
                    cast_id: 0,
                    character: "",
                    credit_id: "",
                    order: 0
                }
            ],
            crew: [
                {
                    adult: 0,
                    gender: 0,
                    id: 0,
                    known_for_department: "",
                    name: "",
                    original_name: "",
                    popularity: 0,
                    profile_path: null,
                    credit_id: "",
                    department: "",
                    job: ""
                }
            ]
        };

        const rate: MovieReleaseDateOutputModelEntity = {
            id: 0,
            results: [
                {
                    iso_3166_1: "",
                    release_dates: []
                }
            ]
        };

        const mockResponse = {
            list,
            credits,
            rate
        };

        spyOn(service, "getMovieMergeDetail").and.returnValue(of(mockResponse));

        service.getMovieMergeDetail("11234", mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得電影詳細資料", () => {
        const mockParams = {
            language: "zh-TW"
        };
        const mockResponse: MovieDetailOutputModelEntity = {
            adult: false,
            backdrop_path: "",
            belongs_to_collection: "",
            budget: 0,
            genres: [],
            homepage: "",
            id: 0,
            imdb_id: "",
            origin_country: [],
            original_language: "",
            original_title: "",
            overview: "",
            popularity: 0,
            poster_path: "",
            production_companies: [],
            production_countries: [],
            release_date: "",
            revenue: 0,
            runtime: 0,
            spoken_languages: [],
            status: "",
            tagline: "",
            title: "",
            video: false,
            vote_average: 0,
            vote_count: 0
        };

        mockTmdbRestfulApiService.get.and.returnValue(of(mockResponse));

        service.getMovieDetail("1123", mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得電影演員", () => {
        const mockParams = {
            language: "zh-TW"
        };
        const mockResponse: MovieCreditsOutputModelEntity = {
            id: 0,
            cast: [
                {
                    adult: 0,
                    gender: 0,
                    id: 0,
                    known_for_department: "",
                    name: "",
                    original_name: "",
                    popularity: 0,
                    profile_path: "",
                    cast_id: 0,
                    character: "",
                    credit_id: "",
                    order: 0
                }
            ],
            crew: [
                {
                    adult: 0,
                    gender: 0,
                    id: 0,
                    known_for_department: "",
                    name: "",
                    original_name: "",
                    popularity: 0,
                    profile_path: null,
                    credit_id: "",
                    department: "",
                    job: ""
                }
            ]
        };

        mockTmdbRestfulApiService.get.and.returnValue(of(mockResponse));

        service.getMovieDetailCredits("1123", mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得電影分級", () => {
        const mockParams = {
            language: "zh-TW"
        };
        const mockResponse: MovieReleaseDateOutputModelEntity = {
            id: 0,
            results: [
                {
                    iso_3166_1: "",
                    release_dates: [
                        {
                            certification: "",
                            descriptors: [],
                            iso_639_1: "",
                            note: "",
                            release_date: "",
                            type: 0
                        }
                    ]
                }
            ]
        };

        mockTmdbRestfulApiService.get.and.returnValue(of(mockResponse));

        service.getMovieDetailRate("1123", mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得電影類型", () => {
        const mockParams = {
            language: "zh-TW"
        };
        const mockResponse: MovieGenreOutputModelEntity = {
            genres: [
                {
                    id: 0,
                    name: ""
                }
            ]
        };

        mockTmdbRestfulApiService.get.and.returnValue(of(mockResponse));

        service.getMovieGenre(mockParams).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });
});
