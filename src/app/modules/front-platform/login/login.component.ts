import { CommonModule } from "@angular/common";
import {
    Component, OnInit
} from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { lastValueFrom } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { CookieService } from "../../../services/cookie.service";
import { TextAlertComponent } from "../../../shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
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
    /**
     * constructor
     * @param fb FormBuilder
     * @param router Router
     * @param userRepositoryService UserRepositoryService
     * @param tmdbRepositoryService TmdbRepositoryService
     * @param userStoreService UserStoreService
     * @param cookieService CookieService
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public fb: FormBuilder,
        public router: Router,
        public userRepositoryService: UserRepositoryService,
        public tmdbRepositoryService: TmdbRepositoryService,
        public userStoreService: UserStoreService,
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

    bgPic = "";

    /**
     * ngOninit
     */
    async ngOnInit() {
        const res = await this.getMovieDetail();
        this.bgPic = res.backdrop_path;
    }

    /**
     * getMovieDetail
     * @returns res res
     */
    async getMovieDetail() {
        const params = {
            language: "zh-TW",
        };

        const res = await lastValueFrom(this.tmdbRepositoryService.getMovieDetail("1104845", params));
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
                    this.cookieService.set("accessToken", res.result.accessToken, 60);
                    this.userStoreService.setUserIsLogin(true);
                    this.userRepositoryService.getUserProfile();
                    this.router.navigate(["/"]);
                } else {
                    this.sweetAlertService.open(TextAlertComponent, {
                        icon: "error",
                        data: {
                            text: "登入失敗"
                        }
                    });
                }
            });
        }
    }
}
