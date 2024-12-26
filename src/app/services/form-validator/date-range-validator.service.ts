import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import moment from "moment";

/**
 * DateRangeValidatorService
 */
@Injectable({
    providedIn: "root"
})
export class DateRangeValidatorService {
    /**
     * dateRangeValidator
     * @returns ValidatorFn
     */
    dateRangeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const startControl = control.get("startDate");
            const endControl = control.get("endDate");

            if (!startControl || !endControl) {
                return null; // 如果控件不存在，不进行验证
            }

            const startDate = startControl.value;
            const endDate = endControl.value;

            // 清除之前的错误
            startControl.setErrors(null);
            endControl.setErrors(null);

            // 如果任意一个为空，则设置错误到对应控件
            if (!startDate) {
                startControl.setErrors({ required: true });
            }
            if (!endDate) {
                endControl.setErrors({ required: true });
            }

            if (!startDate || !endDate) {
                return null; // 如果任意一个为空，不进行后续验证
            }

            // 验证日期格式
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
}
