import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { FormValidatorService } from "@app/services/form-validator/form-validator.service";
import { of } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { MovieListComponent } from "./movie-list.component";

const mockMovieResponse = {
    total_results: 100,
    results: [
        {
            title: "Test Movie",
            overview: "Test Overview",
            release_date: "2024-01-01",
            poster_path: "/test.jpg"
        }
    ]
};

describe("MovieListComponent", () => {
    let component: MovieListComponent;
    let fixture: ComponentFixture<MovieListComponent>;

    const apiServiceSpy = jasmine.createSpyObj(["TmdbRepositoryService", "getMovieList"]);
    const formValidatorService = jasmine.createSpyObj("FormValidatorService", ["dateRangeValidator"]);
    apiServiceSpy.getMovieList.and.returnValue(of(mockMovieResponse));
    formValidatorService.dateRangeValidator.and.returnValue(null);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                MovieListComponent
            ],
            providers: [
                provideRouter([]),
                { provide: TmdbRepositoryService, useValue: apiServiceSpy },
                { provide: FormValidatorService, useValue: formValidatorService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MovieListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("元件是否建立", () => {
        expect(component).toBeTruthy();
    });

    it("在ngInit調用getAllMovieList", () => {
        component.ngOnInit();
        component.getAllMovieList(1, "2024-01-01", "2025-01-01");
        expect(component.movieList.length).toBe(1);
        expect(component.total).toBe(100);
        expect(component.movieList[0].overview).toBe("Test Overview");
    });

    it("確認ngfor是否有選染到畫面上", () => {
        component.ngOnInit();
        component.getAllMovieList(1, "2024-01-01", "2025-01-01");

        const itemEl = fixture.debugElement.queryAll(By.css(".l-movieCard__itme"));
        expect(itemEl.length).toBe(mockMovieResponse.results.length);
    });

    it("測試提交表單並把參數放在路由上", () => {
        const routerSpy = spyOn(component.router, "navigate");
        component.searchForm.patchValue({
            startDate: "2024-03-03",
            endDate: "2024-03-20"
        });

        component.submitForm();

        expect(routerSpy).toHaveBeenCalledWith(["./"], {
            relativeTo: component.route,
            queryParams: {
                startDate: "2024-03-03",
                endDate: "2024-03-20",
                genres: "",
                page: 1,
            }
        });
    });

    it("測試分頁並把參數放在路由上", () => {
        const routerSpy = spyOn(component.router, "navigate");
        component.changePageEmitter(10);

        expect(routerSpy).toHaveBeenCalledWith(["./"], {
            relativeTo: component.route,
            queryParams: {
                startDate: "",
                endDate: "",
                genres: "",
                page: 10,
            }
        });
    });

    it("是否在ngDestory解除queryParams訂閱", () => {
        const sub = spyOn(component.sub, "unsubscribe");
        component.ngOnDestroy();
        expect(sub).toHaveBeenCalled();
    });
});
