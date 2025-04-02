import {
    ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { TmdbRepositoryService } from "@app/core/api/middleware/tmdb/tmdb-repository.service";
import { SweetAlertConfig } from "@app/shared/base/component/sweet-alert/sweet-alert-config";
import { of } from "rxjs";

import { MovieDetailComponent } from "./movie-detail.component";

describe("MovieDetailComponent", () => {
    let component: MovieDetailComponent;
    let fixture: ComponentFixture<MovieDetailComponent>;
    const tmdbRepositoryService = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieMergeDetail"]);

    const mergeDetailMock = {
        list: { genres: [{ name: "動作" }], title: "測試電影" },
        credits: {
            crew: [{ job: "Director", name: "導演A" }],
            cast: [
                { order: 1, name: "演員1" },
                { order: 2, name: "演員2" },
                { order: 3, name: "演員3" },
            ],
        },
        rate: {
            results: [{ iso_3166_1: "US", release_dates: [{ certification: "R" }] }],
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovieDetailComponent],
            providers: [
                { provide: SweetAlertConfig, useValue: { data: { id: 123 } } },
                { provide: TmdbRepositoryService, useValue: tmdbRepositoryService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MovieDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        tmdbRepositoryService.getMovieMergeDetail.and.returnValue(of(mergeDetailMock));
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得電影合併資料", fakeAsync(() => {
        component.getMovieDetail();
        tick();

        expect(component.movieDetail.title).toBe("測試電影");
        expect(component.movieDetail.director).toBe("導演A");
        expect(component.movieDetail.cast).toBe("演員1、演員2、演員3");
        expect(component.movieDetail.rate).toBe("R");
        expect(component.movieDetail.rateImg).toBe("rating_18");
    }));
});
