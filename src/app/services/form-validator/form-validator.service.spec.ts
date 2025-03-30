import { TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { of } from "rxjs";

import { FormValidatorService } from "./form-validator.service";

describe("表單驗證Service", () => {
    let service: FormValidatorService;
    const userRepositoryService = jasmine.createSpyObj("UserRepositoryService", ["postValidEmail"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: UserRepositoryService, useValue: userRepositoryService }
            ]
        });
        service = TestBed.inject(FormValidatorService);
    });

    beforeEach(() => {
        userRepositoryService.postValidEmail.calls.reset();
    });

    it("表單驗證Service是否建立", () => {
        expect(service).toBeTruthy();
    });

    describe("起始/結束日驗證", () => {
        /**
         * testFormGroup
         * @param startDate startDate
         * @param endDate endDate
         * @returns FormGroup
         */
        const testFormGroup = (startDate: string, endDate: string) => new FormBuilder().group(
            {
                startDate,
                endDate
            },
            {
                validators: service.dateRangeValidator()
            }
        );

        it("測試dateRangeValidator都沒填", () => {
            const formValidator = testFormGroup("", "");
            expect(formValidator.get("startDate")?.hasError("required")).toBeTrue();
            expect(formValidator.get("endDate")?.hasError("required")).toBeTrue();
            expect(formValidator.valid).toBeFalse();
        });

        it("測試dateRangeValidator格式填錯", () => {
            const formValidator = testFormGroup("sssaaaa", "2025-03-24");
            expect(formValidator.get("startDate")?.hasError("invalidDate")).toBeTrue();
            expect(formValidator.valid).toBeFalse();
        });

        it("測試dateRangeValidator起始日大於結束日", () => {
            const formValidator = testFormGroup("2025-03-28", "2025-03-24");
            expect(formValidator.get("startDate")?.hasError("startDateAfterEndDate")).toBeTrue();
            expect(formValidator.get("endDate")?.hasError("startDateAfterEndDate")).toBeTrue();
            expect(formValidator.valid).toBeFalse();
        });
    });

    describe("日期格式驗證", () => {
        /**
         * testFormGroup
         * @param date date
         * @returns FormGroup
         */
        const testFormGroup = (date: string) => new FormBuilder().group(
            {
                date: [date, [service.dateFormatValidator()]]
            }
        );

        it("日期格式正確", () => {
            const formValidator = testFormGroup("2015-03-24");
            expect(formValidator.get("date")?.errors).toBeNull();
            expect(formValidator.valid).toBeTrue();
        });

        it("日期格式錯誤", () => {
            const formValidator = testFormGroup("sssaaaa");
            expect(formValidator.get("date")?.hasError("invalidDate")).toBeTrue();
        });
    });

    describe("密碼驗證", () => {
        /**
         * testFormGroup
         * @param password password
         * @param checkPassword checkPassword
         * @returns FormGroup
         */
        const testFormGroup = (password: string, checkPassword: string) => new FormBuilder().group(
            {
                password,
                checkPassword
            },
            {
                validators: service.passwordMatchValidator()
            }
        );

        it("密碼填空", () => {
            const formValidator = testFormGroup("", "");
            expect(formValidator.valid).toBeTrue();
        });

        it("密碼填寫正確", () => {
            const formValidator = testFormGroup("12345678", "12345678");
            expect(formValidator.valid).toBeTrue();
        });

        it("密碼填寫錯誤", () => {
            const formValidator = testFormGroup("12345678", "12345679");
            expect(formValidator.get("checkPassword")?.hasError("passwordNotMatch")).toBeTrue();
            expect(formValidator.valid).toBeFalse();
        });
    });

    describe("email驗證", () => {
        /**
         * testFormGroup
         * @param email email
         * @returns FormGroup
         */
        const testFormGroup = (email: string) => new FormBuilder().group(
            {
                email: [email, {
                    asyncValidators: service.emailValidator(),
                    updateOn: "blur"
                }],
            }
        );

        it("email填空", () => {
            const formValidator = testFormGroup("");
            expect(formValidator.valid).toBeTrue();
        });

        it("email不是gmail", () => {
            const formValidator = testFormGroup("123456@yahoo.com");
            expect(formValidator.valid).toBeFalse();
        });

        it("email重複", () => {
            userRepositoryService.postValidEmail.and.returnValue(of({ result: true }));
            const formValidator = testFormGroup("123456@gmail.com");
            expect(userRepositoryService.postValidEmail).toHaveBeenCalledWith({ email: "123456@gmail.com" });
            expect(formValidator.get("email")?.hasError("emailExist")).toBeTrue();
            expect(formValidator.valid).toBeFalse();
        });
    });
});
