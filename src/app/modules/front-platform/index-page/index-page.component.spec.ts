import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { MovieListOutputModel } from "@app/core/models/outputViewModels/movie/movie-list-output.model";
import { of } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { SwiperDirective } from "../../../shared/base/directives/swiper/swiper.directive";
import { IndexPageComponent } from "./index-page.component";

const mockMovieResponse: MovieListOutputModel["results"][number][] = [
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
];

describe("IndexPageComponent", () => {
    let component: IndexPageComponent;
    let fixture: ComponentFixture<IndexPageComponent>;

    const apiServiceSpy = jasmine.createSpyObj(["TmdbRepositoryService", "getMovieList"]);
    apiServiceSpy.getMovieList.and.returnValue(of(mockMovieResponse));

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                IndexPageComponent
            ],
            providers: [
                provideRouter([]),
                { provide: TmdbRepositoryService, useValue: apiServiceSpy }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(IndexPageComponent);
        component = fixture.componentInstance;

        const swiperElement = fixture.debugElement.queryAll(By.directive(SwiperDirective));
        swiperElement.forEach((item) => {
            const swiperItem = item.injector.get(SwiperDirective);
            swiperItem.el = {
                nativeElement: {
                    initialize: jasmine.createSpy("initialize")
                } as any
            };
        });
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("測試電影列表資料", async () => {
        const tmdbRepositoryService = TestBed.inject(TmdbRepositoryService);

        await component.getAllMovieList(1, "2024-12-12", "2024-12-25");

        const params = {
            language: "zh-TW",
            sort_by: "popularity.desc",
            "primary_release_date.gte": "2024-12-12",
            "primary_release_date.lte": "2024-12-25",
            page: 1
        };
        expect(tmdbRepositoryService.getMovieList).toHaveBeenCalledWith(params);
    });

    it("測試nginit取得電影列表", async () => {
        await component.ngOnInit();

        expect(component.hotMovieList).toEqual(mockMovieResponse);
        expect(component.comingMovieList).toEqual(mockMovieResponse);
    });

    it("掛載SwiperDirective", () => {
        const swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.ngAfterViewInit();
        expect(swiperElement.el.nativeElement.initialize).toHaveBeenCalled();
    });
});
