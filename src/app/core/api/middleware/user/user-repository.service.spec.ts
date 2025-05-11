import { TestBed } from "@angular/core/testing";
import { UserLoginInputModel, UserValidEmailInputModel, UserValidOtpInputModel } from "@app/core/models/inputViewModels/user/user-login-input.model";
import { UserProfileInputModel } from "@app/core/models/inputViewModels/user/user-profile-input.model";
import { BaseApiOutputModel } from "@app/core/models/outputViewModels/base/base-api-output-model";
import { AddressOutputModelEntity } from "@app/core/models/outputViewModels/user/user-address-output-model";
import { UserLoginOutputModelEntity } from "@app/core/models/outputViewModels/user/user-login-output.model";
import { UserProfileOutputModelEntity } from "@app/core/models/outputViewModels/user/user-profile-output.model";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of } from "rxjs";

import { RestfulApiService } from "../../restful/restful-api.service";
import { UserRepositoryService } from "./user-repository.service";

/**
 * TestUserRepositoryService
 */
class TestUserRepositoryService extends UserRepositoryService {
    /**
     * getRefreshProgress
     * @returns refreshProgress
     */
    getRefreshProgress() {
        return this.refreshProgress;
    }

    /**
     * getRefreshTokenSubject
     * @returns refreshTokenSubject
     */
    getRefreshTokenSubject() {
        return this.refreshTokenSubject;
    }
}

describe("UserRepositoryService", () => {
    let service: UserRepositoryService;
    const restfulApiService = jasmine.createSpyObj("RestfulApiService", ["get", "post", "put"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["setUserData"]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: RestfulApiService, useValue: restfulApiService },
                { provide: UserStoreService, useValue: userStoreService }
            ]
        });

        service = TestBed.inject(UserRepositoryService);
    });

    it("確認是否有登入", () => {
        const mockResponse = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.get.and.returnValue(of(mockResponse));
        service.getIsLogin().subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("登入", () => {
        const mockParam: UserLoginInputModel = {
            email: "",
            password: ""
        };

        const mockResponse: UserLoginOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: {
                accessToken: "1133444"
            }
        };

        restfulApiService.post.and.returnValue(of(mockResponse));
        service.postLogin(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("登出", () => {
        const mockResponse: BaseApiOutputModel<null> = {
            statusCode: 200,
            message: "",
            result: null
        };

        restfulApiService.post.and.returnValue(of(mockResponse));
        service.postLogout().subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("換發token成功", () => {
        const testService = new TestUserRepositoryService(
            TestBed.inject(RestfulApiService),
            TestBed.inject(UserStoreService)
        );
        const mockResponse: UserLoginOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: {
                accessToken: "1133444"
            }
        };
        restfulApiService.get.and.returnValue(of(mockResponse));

        spyOn(testService.getRefreshTokenSubject(), "next");

        testService.getReFreshToken().subscribe(() => {
            expect(testService.getRefreshProgress()).toBe(false);
            expect(testService.getRefreshTokenSubject().next).toHaveBeenCalledWith("1133444");
        });
    });

    it("換發token失敗", () => {
        const testService = new TestUserRepositoryService(
            TestBed.inject(RestfulApiService),
            TestBed.inject(UserStoreService)
        );
        const mockResponse: UserLoginOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: {
                accessToken: "1133444"
            }
        };
        restfulApiService.get.and.returnValue(of(mockResponse));

        testService.getReFreshToken();

        expect(testService.getRefreshProgress()).toBeTrue();
        testService.getReFreshToken().subscribe(() => {
            expect(testService.getRefreshTokenSubject().next).toHaveBeenCalledWith("1133444");
        });
    });

    it("取得個人資料", () => {
        const mockResponse: UserProfileOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: {
                userNo: 0,
                name: "",
                email: "",
                countyCode: "",
                districtCode: "",
                postalCode: "",
                address: "",
                sexCode: "",
                birthday: ""
            }
        };

        restfulApiService.get.and.returnValue(of(mockResponse));

        service.getUserProfile();

        expect(userStoreService.setUserData).toHaveBeenCalledWith(mockResponse.result);
    });

    it("註冊帳號", () => {
        const mockParam: UserLoginInputModel = {
            email: "123",
            password: "456"
        };

        const mockResponse: UserLoginOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: {
                accessToken: "1133444"
            }
        };

        restfulApiService.post.and.returnValue(of(mockResponse));
        service.postRegisterAccount(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("註冊帳號發送信件", () => {
        const mockParam: Pick<UserLoginInputModel, "email"> = {
            email: "123"
        };

        const mockResponse: BaseApiOutputModel<boolean> = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.post.and.returnValue(of(mockResponse));
        service.postSendMail(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("驗證OTP", () => {
        const mockParam: UserValidOtpInputModel = {
            email: "123",
            otp: "123456"
        };

        const mockResponse: BaseApiOutputModel<boolean> = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.post.and.returnValue(of(mockResponse));
        service.postValidOtp(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("驗證Email", () => {
        const mockParam: UserValidEmailInputModel = {
            email: "123"
        };

        const mockResponse: BaseApiOutputModel<boolean> = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.post.and.returnValue(of(mockResponse));
        service.postValidEmail(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得縣市", () => {
        const mockResponse: AddressOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: [
                {
                    countyName: "",
                    countyCode: "",
                    district: [
                        {
                            districtName: "",
                            districtCode: "",
                            postalCode: ""
                        }
                    ]
                }
            ]
        };

        restfulApiService.get.and.returnValue(of(mockResponse));
        service.getLocation().subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("修改個人資料", () => {
        const mockParam: UserProfileInputModel = {
            userNo: 0,
            name: "",
            email: "",
            countyCode: "",
            districtCode: "",
            postalCode: "",
            address: "",
            sexCode: "",
            birthday: ""
        };

        const mockResponse: BaseApiOutputModel<boolean> = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.put.and.returnValue(of(mockResponse));
        service.putUserProfile(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("修改密碼", () => {
        const mockParam: UserLoginInputModel = {
            email: "",
            password: ""
        };

        const mockResponse: BaseApiOutputModel<boolean> = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.put.and.returnValue(of(mockResponse));
        service.putResetPassword(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });
});
