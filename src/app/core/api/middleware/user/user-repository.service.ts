import { Injectable } from "@angular/core";
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

    private refreshTokenSubject = new BehaviorSubject<string | null>(null);
    private refreshProgress = false;

    /**
     * 確認是否有登入
     * @returns any
     */
    getIsCheckLogin(): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.get(UserUrl.getIsCheckLogin);
    }

    /**
     * 登入
     * @param params params
     * @returns any
     */
    postLogin<T>(params: T): Observable<BaseApiOutputModel<{ accessToken: string }>> {
        return this.restfulApiService.post(UserUrl.postLogin, params);
    }

    /**
     * 登出
     * @returns any
     */
    postLogout(): Observable<void> {
        return this.restfulApiService.post(UserUrl.postLogout, {});
    }

    /**
     * 換發token
     * @returns any
     */
    getReFreshToken(): Observable<BaseApiOutputModel<{ accessToken: string }>> {
        // 如果有多支api報401且都是換發token狀態，利用flag只發出去1次換發。其他api訂閱被通知後拿到換發後新token
        if (this.refreshProgress === false) {
            this.refreshProgress = true;
            return this.restfulApiService.get<BaseApiOutputModel<{ accessToken: string }>>(UserUrl.getReFreshToken).pipe(
                tap((res) => {
                    this.refreshTokenSubject.next(res.result.accessToken);
                    this.refreshProgress = false;
                }),
                // refresh token如果報錯，通知所有等待中API
                catchError((error) => {
                    this.refreshProgress = false;
                    this.refreshTokenSubject.error(error);
                    return throwError(() => error);
                }),
                concatMap((res) => of(res))
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
        this.restfulApiService.get<any>(UserUrl.getUserProfile).subscribe((res) => {
            this.userStoreService.setUserData(res.result);
        });
    }

    /**
     * 註冊帳號
     * @param params params
     * @returns any
     */
    postRegister(params: any): Observable<any> {
        return this.restfulApiService.post(UserUrl.postRegister, params);
    }

    /**
     * 註冊帳號發送信件
     * @param params params
     * @returns any
     */
    postSendMail(params: any): Observable<any> {
        return this.restfulApiService.post(UserUrl.postSendMail, params);
    }

    /**
     * 驗證OTP
     * @param params params
     * @returns any
     */
    postValidOtp(params: any): Observable<any> {
        return this.restfulApiService.post(UserUrl.postValidOtp, params);
    }

    /**
     * 驗證Email
     * @param params params
     * @returns any
     */
    postValidEmail(params: any): Observable<any> {
        return this.restfulApiService.post(UserUrl.postValidEmail, params);
    }

    /**
     * 取得otp Email
     * @returns any
     */
    getOtpEmail(): Observable<any> {
        return this.restfulApiService.get(UserUrl.getOtpEmail);
    }

    /**
     * 取得縣市
     * @returns any
     */
    getLocation<T>(): Observable<T> {
        return this.restfulApiService.get(UserUrl.getLocation);
    }

    /**
     * 修改個人資料
     * @param param 使用者資料
     * @returns any
     */
    putUserProfile<T>(param: T): Observable<BaseApiOutputModel<any>> {
        return this.restfulApiService.put(UserUrl.putUserProfile, param);
    }

    /**
     * 修改密碼
     * @param param 使用者資料
     * @returns any
     */
    putResetPassword<T>(param: T): Observable<BaseApiOutputModel<any>> {
        return this.restfulApiService.put(UserUrl.putResetPassword, param);
    }
}
