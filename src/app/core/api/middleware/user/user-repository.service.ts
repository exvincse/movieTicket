import { Injectable } from "@angular/core";
import {
    UserGoogleLoginInputModel, UserLoginInputModel, UserValidEmailInputModel, UserValidOtpInputModel
} from "@app/core/models/inputViewModels/user/user-login-input.model";
import { UserProfileInputModel } from "@app/core/models/inputViewModels/user/user-profile-input.model";
import { AddressOutputModelEntity } from "@app/core/models/outputViewModels/user/user-address-output-model";
import { UserLoginOutputModelEntity } from "@app/core/models/outputViewModels/user/user-login-output.model";
import { UserProfileOutputModelEntity } from "@app/core/models/outputViewModels/user/user-profile-output.model";
import {
    BehaviorSubject, catchError, concatMap, filter, Observable, of, tap,
    throwError
} from "rxjs";

import { UserStoreService } from "../../../../store/user/service/user-store.service";
import { BaseApiOutputModel } from "../../../models/outputViewModels/base/base-api-output-model";
import { UserUrl } from "../../api-url/user-url";
import { RestfulApiService } from "../../restful/restful-api.service";

/**
 * UserRepositoryService
 */
@Injectable({
    providedIn: "root"
})
export class UserRepositoryService {
    /**
     * constructor
     * @param restfulApiService RestfulApiService
     * @param userStoreService UserStoreService
     */
    constructor(
        public restfulApiService: RestfulApiService,
        public userStoreService: UserStoreService,
    ) { }

    protected refreshTokenSubject = new BehaviorSubject<string | null>(null);
    protected refreshProgress = false;

    /**
     * 確認是否有登入
     * @returns any
     */
    getIsLogin(): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.get(UserUrl.getIsLogin);
    }

    /**
     * 登入
     * @param params params
     * @returns any
     */
    postLogin(params: UserLoginInputModel): Observable<UserLoginOutputModelEntity> {
        return this.restfulApiService.post(UserUrl.postLogin, params);
    }

    /**
     * Google登入
     * @param params params
     * @returns any
     */
    postGoogleLogin(params: UserGoogleLoginInputModel): Observable<UserLoginOutputModelEntity> {
        return this.restfulApiService.post(UserUrl.postGoogleLogin, params);
    }

    /**
     * 登出
     * @returns any
     */
    postLogout(): Observable<BaseApiOutputModel<null>> {
        return this.restfulApiService.post(UserUrl.postLogout, {});
    }

    /**
     * 換發token
     * @returns any
     */
    getReFreshToken(): Observable<UserLoginOutputModelEntity> {
        // 如果有多支api報401且都是換發token狀態，利用flag只發出去1次換發。其他api訂閱被通知後拿到換發後新token
        if (this.refreshProgress === false) {
            this.refreshProgress = true;
            return this.restfulApiService.get<UserLoginOutputModelEntity>(UserUrl.getReFreshToken).pipe(
                tap((res) => {
                    this.refreshTokenSubject.next(res.result.accessToken);
                    this.refreshProgress = false;
                }),
                // refresh token如果報錯，通知所有等待中API
                catchError((error) => {
                    this.refreshProgress = false;
                    this.refreshTokenSubject.error(error);
                    return throwError(() => error);
                })
            );
        }

        // 如果有api進行換發token，其他api等候訂閱通知
        return this.refreshTokenSubject.asObservable().pipe(
            filter((token) => token !== null),
            concatMap((token) => of({
                statusCode: 200,
                message: "",
                result: {
                    accessToken: token
                }
            }))
        );
    }

    /**
     * 取得個人資料
     */
    getUserProfile() {
        this.restfulApiService.get<UserProfileOutputModelEntity>(UserUrl.getUserProfile).subscribe((res) => {
            this.userStoreService.setUserData(res.result);
        });
    }

    /**
     * 註冊帳號
     * @param params params
     * @returns any
     */
    postRegisterAccount(params: UserLoginInputModel): Observable<UserLoginOutputModelEntity> {
        return this.restfulApiService.post(UserUrl.postRegisterAccount, params);
    }

    /**
     * 註冊帳號發送信件
     * @param params params
     * @returns any
     */
    postSendMail(params: Pick<UserLoginInputModel, "email">): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.post(UserUrl.postSendMail, params);
    }

    /**
     * 驗證OTP
     * @param params params
     * @returns any
     */
    postValidOtp(params: UserValidOtpInputModel): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.post(UserUrl.postValidOtp, params);
    }

    /**
     * 驗證Email
     * @param params params
     * @returns any
     */
    postValidEmail(params: UserValidEmailInputModel): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.post(UserUrl.postValidEmail, params);
    }

    /**
     * 取得縣市
     * @returns any
     */
    getLocation(): Observable<AddressOutputModelEntity> {
        return this.restfulApiService.get(UserUrl.getLocation);
    }

    /**
     * 修改個人資料
     * @param param 使用者資料
     * @returns any
     */
    putUserProfile(param: UserProfileInputModel): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.put(UserUrl.putUserProfile, param);
    }

    /**
     * 修改密碼
     * @param param 使用者資料
     * @returns any
     */
    putResetPassword(param: UserLoginInputModel): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.put(UserUrl.putResetPassword, param);
    }
}
