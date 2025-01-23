import { CommonModule } from "@angular/common";
import {
    Component, OnDestroy, OnInit
} from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Subscription } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb.repository.service";
import { DateRangeValidatorService } from "../../../services/form-validator/date-range-validator.service";
import { DatePickerComponent } from "../../../shared/base/component/date-picker/date-picker.component";
import { GlightboxComponent } from "../../../shared/base/component/glightbox/glightbox.component";
import { GlightboxService } from "../../../shared/base/component/glightbox/service/glightbox.service";
import { PagerComponent } from "../../../shared/base/component/pager/pager.component";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * MovieListComponent
 */
@Component({
    selector: "app-movie-list",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        StopPropagationDirective,
        PagerComponent,
        DatePickerComponent
    ],
    templateUrl: "./movie-list.component.html",
    styleUrl: "./movie-list.component.scss"
})
export class MovieListComponent implements OnInit, OnDestroy {
    /**
     * constructor
     * @param tmdbRepositoryService TmdbRepositoryService
     * @param dateRangeValidatorService DateRangeValidatorService
     * @param glightboxService glightboxService
     * @param router router
     * @param route activatedRoute
     * @param fb FormBuilder
     */
    constructor(
        public tmdbRepositoryService: TmdbRepositoryService,
        public dateRangeValidatorService: DateRangeValidatorService,
        public glightboxService: GlightboxService,
        public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder
    ) {
        this.sub = this.route.queryParams.subscribe((params: any) => {
            this.nowPage = parseInt(params.page, 10) || 1;
            this.getAllMovieList(this.nowPage, params.startDate, params.endDate, params.genres);
        });

        this.searchForm = this.fb.group(
            {
                startDate: ["", Validators.required],
                endDate: ["", Validators.required]
            },
            {
                validators: this.dateRangeValidatorService.dateRangeValidator()
            }
        );
    }

    searchForm!: FormGroup;

    sub: Subscription;

    movieList: any[] = [];

    total = 0;

    nowPage = 1;

    localeConfig = {
        format: "YYYY-MM-DD",
    };

    lightboxOptions = {
        zoomable: true
    };

    /**
     * on init
     */
    ngOnInit() {
        this.getAllMovieList();
    }

    /**
     * destory
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    /**
     * submitForm
     */
    submitForm() {
        if (this.searchForm.valid) {
            const dateValue = this.searchForm.getRawValue();
            this.router.navigate(["./"], {
                relativeTo: this.route,
                queryParams: {
                    startDate: dateValue.startDate,
                    endDate: dateValue.endDate,
                    genres: this.route.snapshot.queryParams["genres"] || "",
                    page: 1
                }
            });
        }
    }

    /**
     * formTouch
     */
    formTouch() {
        this.searchForm.controls["endDate"].markAsTouched();
        this.searchForm.controls["startDate"].markAsTouched();
    }

    /**
     * getAllMovieList
     * @param page page
     * @param startDate startDate
     * @param endDate endDate
     * @param with_genres with_genres
     */
    getAllMovieList(page = 1, startDate?: string, endDate?: string, with_genres = "") {
        const params = {
            language: "zh-TW",
            sort_by: "popularity.desc",
            "primary_release_date.gte": startDate || "",
            "primary_release_date.lte": endDate || "",
            with_genres,
            page
        };

        this.tmdbRepositoryService.getMovieList(params).subscribe((res) => {
            this.total = res.total_results;
            this.movieList = res.results;
        });
    }

    /**
     * changePageEmitter
     * @param page page
     */
    changePageEmitter(page: number) {
        this.nowPage = page;
        this.router.navigate(["./"], {
            relativeTo: this.route,
            queryParams: {
                startDate: this.route.snapshot.queryParams["startDate"] || "",
                endDate: this.route.snapshot.queryParams["endDate"] || "",
                genres: this.route.snapshot.queryParams["genres"] || "",
                page
            }
        });
    }

    /**
     * openLightbox
     * @param url url
     */
    openLightbox(url: string): void {
        this.glightboxService.open(GlightboxComponent, { url });
    }
}
