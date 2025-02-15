import { CommonModule } from "@angular/common";
import {
    Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren
} from "@angular/core";
import {
    FormArray, FormBuilder, FormGroup, ReactiveFormsModule
} from "@angular/forms";

import { UserRepositoryService } from "../../../core/api/middleware/user/user-repository.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * OtpValidComponent
 */
@Component({
    selector: "app-otp-valid",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, StopPropagationDirective],
    templateUrl: "./otp-valid.component.html",
    styleUrl: "./otp-valid.component.scss"
})
export class OtpValidComponent {
    @Input() otpEmail = "";

    @Output() emitValidOtp = new EventEmitter<boolean>();

    @ViewChildren("otpInput") otpInput!: QueryList<ElementRef>;

    otpForm: FormGroup;

    /**
     * constructor
     * @param userRepositoryService UserRepositoryService
     * @param fb FormBuilder
     */
    constructor(
        public userRepositoryService: UserRepositoryService,
        public fb: FormBuilder
    ) {
        this.otpForm = this.fb.group({
            otp: this.fb.array(new Array(6).fill("").map(() => [""]))
        });
    }

    /**
     * otpInputArray
     * @returns otpInputArray
     */
    get otpInputArray(): FormArray {
        return this.otpForm.get("otp") as FormArray;
    }

    /**
     * maskEmail
     * @returns maskEmail
     */
    get maskEmail() {
        return this.otpEmail.replace(/^(.{2})(.{4})(.*@)/, (match, p1, p2, p3) => [p1, "*".repeat(4), p3].join(""));
    }

    /**
     * otpInputFocus
     * @param event event
     * @param index index
     */
    otpInputFocus(event: Event, index: number) {
        const inputElement = event.target as HTMLInputElement;
        inputElement.value = inputElement.value.replace(/[^0-9]/g, "");

        if (inputElement.value.length === 1 && index < this.otpInput.length - 1) {
            this.otpInput.get(index + 1)?.nativeElement.focus();
        }
    }

    /**
     * otpInputBack
     * @param event event
     * @param index index
     */
    otpInputBack(event: KeyboardEvent, index: number) {
        const inputElement = event.target as HTMLInputElement;
        if (event.key === "Backspace" && index > 0 && inputElement.value === "") {
            this.otpInput.get(index - 1)?.nativeElement.focus();
        }
    }

    /**
     * submitOtp
     */
    submitOtp() {
        const value = this.otpForm.getRawValue();

        const params = {
            email: this.otpEmail,
            otp: value.otp.join("")
        };

        this.userRepositoryService.postValidOtp(params).subscribe((res) => {
            this.emitValidOtp.emit(res.result);
            this.otpForm.reset();
            this.otpInput.first?.nativeElement.focus();
        });
    }
}
