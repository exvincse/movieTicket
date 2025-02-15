import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import moment from "moment";
import { catchError, map, of } from "rxjs";

import { UserRepositoryService } from "../../core/api/middleware/user/user-repository.service";

/**
 * FormValidatorService
 */
@Injectable({
    providedIn: "root"
})
export class FormValidatorService {
    /**
     * constructor
     * @param userRepositoryService UserRepositoryService
     */
    constructor(private userRepositoryService: UserRepositoryService) { }

    /**
     * dateRangeValidator
     * @returns ValidatorFn
     */
    dateRangeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const startControl = control.get("startDate");
            const endControl = control.get("endDate");

            if (!startControl || !endControl) {
                return null;
            }

            const startDate = startControl.value;
            const endDate = endControl.value;

            startControl.setErrors(null);
            endControl.setErrors(null);

            if (!startDate) {
                startControl.setErrors({ required: true });
            }
            if (!endDate) {
                endControl.setErrors({ required: true });
            }

            if (!startDate || !endDate) {
                return null;
            }

            const startMoment = moment(startDate, "YYYY-MM-DD", true);
            const endMoment = moment(endDate, "YYYY-MM-DD", true);

            if (!startMoment.isValid()) {
                startControl.setErrors({ invalidDate: true });
            }
            if (!endMoment.isValid()) {
                endControl.setErrors({ invalidDate: true });
            }

            if (!startMoment.isValid() || !endMoment.isValid()) {
                return null;
            }

            if (startMoment.isAfter(endMoment) || endMoment.isBefore(startMoment)) {
                startControl.setErrors({ startDateAfterEndDate: true });
                endControl.setErrors({ startDateAfterEndDate: true });
            }

            return null;
        };
    }

    /**
     * dateFormatValidator
     * @returns ValidatorFn
     */
    dateFormatValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value) return null;

            const startMoment = moment(control.value, "YYYY-MM-DD", true);

            if (!startMoment.isValid()) {
                control.setErrors({ invalidDate: true });
            }

            return null;
        };
    }

    /**
     * passwordValidator
     * @returns ValidatorFn
     */
    passwordMatchValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get("password");
            const checkPassword = control.get("checkPassword");

            if (!password || !checkPassword) {
                return null;
            }

            if (!checkPassword?.value) {
                checkPassword?.setErrors({ required: true });
            }

            if (!password.value || !checkPassword.value) {
                return null;
            }

            if (password?.value !== checkPassword?.value) {
                checkPassword?.setErrors({ passwordNotMatch: true });
            }

            return null;
        };
    }

    /**
     * emailValidator
     * @returns ValidatorFn
     */
    emailValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === "") {
                return of(null);
            }

            return this.userRepositoryService.postValidEmail({ email: control.value }).pipe(
                map((res) => (res.result ? { emailExist: true, message: res.message } : null)),
                catchError(() => of(null))
            );
        };
    }
}
