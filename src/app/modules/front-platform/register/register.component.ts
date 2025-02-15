import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { CookieService } from "../../../services/cookie.service";
import { FormValidatorService } from "../../../services/form-validator/form-validator.service";
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
export class RegisterComponent {
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
     */
    constructor(
        public fb: FormBuilder,
        public formValidatorService: FormValidatorService,
        public router: Router,
        public userRepositoryService: UserRepositoryService,
        public cookieService: CookieService
    ) {
        this.registerForm = this.fb.group({
            // email: ["", [
            //     Validators.required,
            //     Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
            // ], this.formValidatorService.emailValidator()],
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
        this.currentStep = "register";
        const param = {
            email: this.registerForm.get("email")?.value,
            password: this.registerForm.get("password")?.value
        };

        this.userRepositoryService.postRegister(param).subscribe((res) => {
            if (res.result.accessToken) {
                this.cookieService.set("accessToken", res.result.accessToken, 5);
                this.router.navigate(["/"]);
            } else {
                // 註冊失敗
            }
        });
    }
}
