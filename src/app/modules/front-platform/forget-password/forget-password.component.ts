import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators
} from "@angular/forms";
import { Router } from "@angular/router";

import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { FormValidatorService } from "../../../services/form-validator/form-validator.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { OtpValidComponent } from "../otp-valid/otp-valid.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

/**
 * ForgetPasswordComponent
 */
@Component({
    selector: "app-forget-password",
    imports: [CommonModule, FormsModule, ReactiveFormsModule, StopPropagationDirective, OtpValidComponent, ResetPasswordComponent],
    standalone: true,
    templateUrl: "./forget-password.component.html",
    styleUrl: "./forget-password.component.scss"
})
export class ForgetPasswordComponent {
    /**
     * constructor
     * @param fb FormBuilder
     * @param formValidatorService FormValidatorService
     * @param router Router
     * @param userRepositoryService UserRepositoryService
     */
    constructor(
        public fb: FormBuilder,
        public formValidatorService: FormValidatorService,
        public router: Router,
        public userRepositoryService: UserRepositoryService
    ) {
        this.forgetForm = this.fb.group({
            email: ["", {
                validators: [
                    Validators.required,
                    Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
                ]
            }]
        });
    }

    forgetForm!: FormGroup;

    currentStep: "email" | "otp" | "resetPassword" = "email";

    /**
     * Gets the email form control.
     * @returns {AbstractControl | null} The email form control.
     */
    get otpEmail() {
        return this.forgetForm.get("email")?.value;
    }

    /**
     * validEmail
     */
    validEmail() {
        if (this.forgetForm.valid === true) {
            const value = this.forgetForm.getRawValue();
            this.userRepositoryService.postSendMail({ email: value.email }).subscribe((res) => {
                if (res.result === true) {
                    this.currentStep = "otp";
                }
            });
        }
    }

    /**
     * otpValid
     * @param isValid isValid
     */
    emitValidOtp(isValid: boolean) {
        if (isValid === true) {
            this.currentStep = "resetPassword";
        }
    }
}
