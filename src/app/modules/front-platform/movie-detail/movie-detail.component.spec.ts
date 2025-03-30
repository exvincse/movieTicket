import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TmdbRepositoryService } from "@app/core/api/middleware/tmdb/tmdb-repository.service";
import { SweetAlertConfig } from "@app/shared/base/component/sweet-alert/sweet-alert-config";

import { MovieDetailComponent } from "./movie-detail.component";

describe("MovieDetailComponent", () => {
    let component: MovieDetailComponent;
    let fixture: ComponentFixture<MovieDetailComponent>;
    const tmdbRepositoryService = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieDetail", "getMovieDetailCredits", "getMovieDetailRate"]);
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MovieDetailComponent],
            providers: [
                SweetAlertConfig,
                { provide: TmdbRepositoryService, useValue: tmdbRepositoryService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MovieDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });
});
