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
}
