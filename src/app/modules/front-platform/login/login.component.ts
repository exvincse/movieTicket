import { CommonModule } from "@angular/common";
import {
    Component, OnInit, TemplateRef, ViewChild
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { lastValueFrom } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { CookieService } from "../../../services/cookie.service";
import { SweetAlertService } from "../../../shared/base/component/sweet-alert/service/sweet-alert.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * LoginComponent
 */
@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        StopPropagationDirective
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent implements OnInit {
    @ViewChild("customTemplate") customTemplate!: TemplateRef<any>;

    /**
     * constructor
     * @param fb FormBuilder
     * @param router Router
     * @param userRepositoryService UserRepositoryService
     * @param tmdbRepositoryService TmdbRepositoryService
     * @param cookieService CookieService
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public fb: FormBuilder,
        public router: Router,
        public userRepositoryService: UserRepositoryService,
        public tmdbRepositoryService: TmdbRepositoryService,
        public cookieService: CookieService,
        public sweetAlertService: SweetAlertService
    ) {
        this.loginForm = this.fb.group({
            email: ["", [
                Validators.required,
                Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
            ]],
            password: ["", [Validators.required, Validators.minLength(8)]],
        });
    }

    loginForm!: FormGroup;

    faEye = faEye;
    faEyeSlash = faEyeSlash;

    isHiddenEye = true;

    loginBg = "";

    /**
     * ngOninit
     */
    async ngOnInit() {
        const hotStartDate = moment().startOf("month");
        const hotEndDate = moment().endOf("month");
        const hotRes = await this.getAllMovieList(1, hotStartDate.format("YYYY-MM-DD"), hotEndDate.format("YYYY-MM-DD"));
        this.loginBg = hotRes.results[0].backdrop_path;
    }

    /**
     * getAllMovieList
     * @param page page
     * @param startDate startDate
     * @param endDate endDate
     * @returns res res
     */
    async getAllMovieList(page = 1, startDate?: string, endDate?: string) {
        const params = {
            language: "zh-TW",
            sort_by: "popularity.desc",
            "primary_release_date.gte": startDate || "",
            "primary_release_date.lte": endDate || "",
            page
        };

        const res = await lastValueFrom(this.tmdbRepositoryService.getMovieList(params));
        return res;
    }

    /**
     * toggleEye
     */
    toggleEye() {
        this.isHiddenEye = !this.isHiddenEye;
    }

    /**
     * login
     */
    login() {
        if (this.loginForm.valid === true) {
            const value = this.loginForm.getRawValue();
            const param = {
                email: value.email,
                password: value.password
            };

            this.userRepositoryService.postLogin(param).subscribe((res) => {
                if (res.result.accessToken) {
                    this.cookieService.set("accessToken", res.result.accessToken, 5);
                    this.userRepositoryService.getUserProfile();
                    this.router.navigate(["/"]);
                } else {
                    this.sweetAlertService.open(this.customTemplate, {
                        icon: "error"
                    });
                }
            });
        }
    }
}
