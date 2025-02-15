import { Injectable } from "@angular/core";

declare const google: any;

/**
 * GoogleAuthService
 */
@Injectable({
    providedIn: "root"
})
export class GoogleAuthService {
    private clientId = "194845046746-5dhfauh54o5mkobs5htrvkggq6t0suhn.apps.googleusercontent.com";

    /**
     * loadGoogleAuth
     * 返回 Promise 確保 Google API 初始化完成
     */
    loadGoogleAuth(): Promise<void> {
        return new Promise((resolve, reject) => {
            google.accounts.id.initialize({
                client_id: this.clientId,
                callback: this.handleCredentialResponse.bind(this),
            });

            // 確保 API 初始化完成後再進行下一步
            if (google.accounts) {
                google.accounts.id.disableAutoSelect();
                resolve();
            } else {
                reject();
            }
        });
    }

    /**
     * renderGoogleButton
     * 在 API 加載完後渲染按鈕
     */
    renderGoogleButton(): void {
        google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { theme: "outline", size: "large" }
        );
    }

    /**
     * signInWithGoogle
     * 顯示登入視窗
     */
    signInWithGoogle(): void {
        google.accounts.id.prompt(); // 手動觸發登入彈窗
    }

    /**
     * handleCredentialResponse
     * @param response 回應資料
     */
    private handleCredentialResponse(response: any): void {
        console.log("Google Token:", response);
        // 處理登入的回應，將 token 傳送到後端進行驗證
    }
}
