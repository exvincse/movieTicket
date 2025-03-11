import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { CookieService } from "../../../services/cookie.service";
import { FormValidatorService } from "../../../services/form-validator/form-validator.service";
import { TextAlertComponent } from "../../../shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "../../../shared/base/component/sweet-alert/service/sweet-alert.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * ResetPasswordComponent
 */
@Component({
    selector: "app-reset-password",
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,
        StopPropagationDirective,
    ],
    standalone: true,
    templateUrl: "./reset-password.component.html",
    styleUrl: "./reset-password.component.scss"
})
export class ResetPasswordComponent {
    @Input() otpEmail = "";

    faEye = faEye;
    faEyeSlash = faEyeSlash;

    isHiddenEye = true;
    isHiddenCheckEye = true;

    /**
     * constructor
     * @param fb FormBuilder
     * @param formValidatorService FormValidatorService
     * @param router Router
     * @param userRepositoryService UserRepositoryService
     * @param cookieService CookieService
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public fb: FormBuilder,
        public formValidatorService: FormValidatorService,
        public router: Router,
        public userRepositoryService: UserRepositoryService,
        public cookieService: CookieService,
        public sweetAlertService: SweetAlertService
    ) {
        this.registerForm = this.fb.group({
            password: ["", [Validators.required, Validators.minLength(8)]],
            checkPassword: ["", [Validators.required, Validators.minLength(8)]]
        }, { validators: this.formValidatorService.passwordMatchValidator() });
    }

    registerForm!: FormGroup;

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
     * resetPassword
     */
    resetPassword() {
        if (this.registerForm.valid === true) {
            const value = this.registerForm.getRawValue();
            const param = {
                email: this.otpEmail,
                password: value.password
            };

            this.userRepositoryService.putResetPassword(param).subscribe((res) => {
                const ref = this.sweetAlertService.open(TextAlertComponent, {
                    icon: res.result ? "success" : "error",
                    data: {
                        text: res.message
                    }
                });

                ref.instance.afterClose.subscribe(() => {
                    if (res.result) {
                        this.router.navigate(["/login"]);
                    }
                });
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
}
