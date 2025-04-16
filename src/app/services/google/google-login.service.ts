import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";

import { CookieService } from "../cookie/cookie.service";

declare const google: any;

/**
 * GoogleAuthService
 */
@Injectable({
    providedIn: "root"
})
export class GoogleAuthService {
    private clientId = "194845046746-ind8shn8n3c52pjiishd4gbelkq379pe.apps.googleusercontent.com";

    /**
     * constructor
     * @param userRepositoryService UserRepositoryService
     * @param cookieService CookieService
     * @param userStoreService UserStoreService
     * @param router Router
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        private userRepositoryService: UserRepositoryService,
        private cookieService: CookieService,
        private userStoreService: UserStoreService,
        private router: Router,
        private sweetAlertService: SweetAlertService
    ) { }

    /**
     * loadGoogleAuth
     * 返回 Promise 確保 Google API 初始化完成
     */
    loadGoogleAuth() {
        google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleResponse.bind(this),
            auto_select: false
        });

        const button = document.getElementById("googleSign");

        google.accounts.id.renderButton(
            button,
            {
                theme: "outline",
                size: "large"
            }
        );
    }

    /**
     * handleResponse
     * @param response 回應資料
     */
    handleResponse(response: any): void {
        const googleToken = response.credential;
        this.userRepositoryService.postGoogleLogin({ googleToken }).subscribe((res) => {
            if (res.result.accessToken) {
                this.cookieService.set("accessToken", res.result.accessToken, 60);
                this.userStoreService.setUserIsLogin(true);
                this.userRepositoryService.getUserProfile();
                this.router.navigate(["/"]);
            } else {
                this.sweetAlertService.open(TextAlertComponent, {
                    icon: "error",
                    data: {
                        text: "登入失敗"
                    }
                });
            }
        });
    }
}
