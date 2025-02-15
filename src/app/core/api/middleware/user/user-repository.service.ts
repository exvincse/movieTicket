import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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
     */
    constructor(public restfulApiService: RestfulApiService) { }

    /**
     * 登入
     * @param params params
     * @returns any
     */
    postLogin(params: any): Observable<any> {
        return this.restfulApiService.post(UserUrl.postLogin, params);
    }

    /**
     * 登出
     * @returns any
     */
    postLogout(): Observable<any> {
        return this.restfulApiService.post(UserUrl.postLogout, {});
    }

    /**
     * 換發token
     * @returns any
     */
    getReFreshToken(): Observable<any> {
        return this.restfulApiService.get(UserUrl.getReFreshToken);
    }

    /**
     * 取得個人資料
     * @returns any
     */
    getUserProfile(): Observable<any> {
        return this.restfulApiService.get(UserUrl.getUserProfile);
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
    putUserProfile<T>(param: T): Observable<any> {
        return this.restfulApiService.put(UserUrl.putUserProfile, param);
    }
}
