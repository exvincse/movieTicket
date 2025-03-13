import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,
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
import { FormValidatorService } from "../../../services/form-validator/form-validator.service";
import { TextAlertComponent } from "../../../shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "../../../shared/base/component/sweet-alert/service/sweet-alert.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { OtpValidComponent } from "../otp-valid/otp-valid.component";

/**
 * RegisterComponent
 */
@Component({
    selector: "app-register",
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        StopPropagationDirective,
        OtpValidComponent
    ],
    standalone: true,
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss"
})
export class RegisterComponent implements OnInit {
    /**
     * constructor
     * @param fb FormBuilder
     * @param formValidatorService FormValidatorService
     * @param router Router
     * @param userRepositoryService UserRepositoryService
     * @param tmdbRepositoryService TmdbRepositoryService
     * @param userStoreService UserStoreService
     * @param cookieService CookieService
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public fb: FormBuilder,
        public formValidatorService: FormValidatorService,
        public router: Router,
        public userRepositoryService: UserRepositoryService,
        public tmdbRepositoryService: TmdbRepositoryService,
        public userStoreService: UserStoreService,
        public cookieService: CookieService,
        public sweetAlertService: SweetAlertService
    ) {
        this.registerForm = this.fb.group({
            email: ["", {
                validators: [
                    Validators.required,
                    Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
                ],
                asyncValidators: [this.formValidatorService.emailValidator()],
                updateOn: "blur"
            }],
            password: ["", [Validators.required, Validators.minLength(8)]],
            checkPassword: ["", [Validators.required, Validators.minLength(8)]]
        }, { validators: this.formValidatorService.passwordMatchValidator() });
    }

    registerForm!: FormGroup;

    currentStep: "register" | "otp" = "register";

    faEye = faEye;
    faEyeSlash = faEyeSlash;

    isHiddenEye = true;
    isHiddenCheckEye = true;

    bgPic = "";

    /**
     * ngOninit
     */
    async ngOnInit() {
        const res = await this.getMovieDetail();
        this.bgPic = res.backdrop_path;
    }

    /**
     * Gets the email form control.
     * @returns {AbstractControl | null} The email form control.
     */
    get otpEmail() {
        return this.registerForm.get("email")?.value;
    }

    /**
     * toggleEye
     */
    toggleEye() {
        this.isHiddenEye = !this.isHiddenEye;
    }

    /**
     * toggleCheckEye
     */
    toggleCheckEye() {
        this.isHiddenCheckEye = !this.isHiddenCheckEye;
    }

    /**
     * registerEmail
     */
    registerEmail() {
        if (this.registerForm.valid === true) {
            const value = this.registerForm.getRawValue();
            this.userRepositoryService.postSendMail({ email: value.email }).subscribe((res) => {
                if (res.result === true) {
                    this.currentStep = "otp";
                }
            });
        }
    }

    /**
     * otpValid
     */
    emitValidOtp() {
        const param = {
            email: this.registerForm.get("email")?.value,
            password: this.registerForm.get("password")?.value
        };

        this.userRepositoryService.postRegister(param).subscribe((res) => {
            if (res.result.accessToken) {
                const ref = this.sweetAlertService.open(TextAlertComponent, {
                    icon: "success",
                    data: {
                        text: "註冊成功"
                    }
                });
                ref.instance.afterClose.subscribe(() => {
                    this.cookieService.set("accessToken", res.result.accessToken, 60);
                    this.userStoreService.setUserIsLogin(true);
                    this.userRepositoryService.getUserProfile();
                    this.router.navigate(["/"]);
                });
            } else {
                this.sweetAlertService.open(TextAlertComponent, {
                    icon: "error",
                    data: {
                        text: "註冊失敗"
                    }
                });
            }
        });
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
}
