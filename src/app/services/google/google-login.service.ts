import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Router } from "@angular/router";
import { UserRepositoryService } from "@app/core/api/middleware/user/user-repository.service";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";

import { CookieService } from "../cookie/cookie.service";

declare global {
    interface Window {
        google: any;
    }
}

export const GOOGLE = new InjectionToken<any>("google", {
    providedIn: "root",
    /**
     * factory
     * @returns window.google
     */
    factory: () => {
        if (!window.google) {
            throw new Error("Google script not loaded!");
        }
        return window.google;
    }
});

/**
 * GoogleLoginService
 */
@Injectable({
    providedIn: "root"
})
export class GoogleLoginService {
    private clientId = "194845046746-ind8shn8n3c52pjiishd4gbelkq379pe.apps.googleusercontent.com";

    /**
     * constructor
     * @param userRepositoryService UserRepositoryService
     * @param cookieService CookieService
     * @param userStoreService UserStoreService
     * @param router Router
     * @param sweetAlertService SweetAlertService
     * @param google Google API
     */
    constructor(
        private userRepositoryService: UserRepositoryService,
        private cookieService: CookieService,
        private userStoreService: UserStoreService,
        private router: Router,
        private sweetAlertService: SweetAlertService,
        @Inject(GOOGLE) private google: any
    ) { }

    /**
     * loadGoogleAuth
     * 返回 Promise 確保 Google API 初始化完成
     */
    loadGoogleAuth() {
        this.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleResponse.bind(this),
            auto_select: false
        });

        const button = document.getElementById("googleSign");

        this.google.accounts.id.renderButton(
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
    handleResponse(response: any) {
        const googleToken = response.credential;

        if (!googleToken) {
            this.sweetAlertService.open(TextAlertComponent, {
                icon: "error",
                data: {
                    text: "登入失敗"
                }
            });
            return;
        }

        this.userRepositoryService.postGoogleLogin({ googleToken }).subscribe((res) => {
            if (res.result.accessToken) {
                this.cookieService.set("accessToken", res.result.accessToken, 60);
                this.userStoreService.setUserIsLogin(true);
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
