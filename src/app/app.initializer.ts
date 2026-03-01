import { Injector } from "@angular/core";
import { lastValueFrom } from "rxjs";

import { UserRepositoryService } from "./core/api/middleware/user/user-repository.service";
import { UserStoreService } from "./store/user/service/user-store.service";

/**
 * 初始化時取得環境設定
 * @param injector Angular DI 注入器
 * @returns 一個回傳 Promise 的函式
 */
export function settingFactory(injector: Injector) {
    return async () => {
        const userRepositoryService = injector.get(UserRepositoryService);
        const userStoreService = injector.get(UserStoreService);
        try {
            const res = await lastValueFrom(userRepositoryService.getSetting());
            userStoreService.setSettingData(res.result);
        } catch (error) {
            userStoreService.setSettingData({
                tmdbApiKey: "",
                pdAzureSubKey: ""
            });
        }
    };
}

/**
 * 初始化時檢查是否登入
 * @param injector Angular DI 注入器
 * @returns 一個回傳 Promise 的函式
 */
export function isLoginFactory(injector: Injector) {
    return async () => {
        const userRepositoryService = injector.get(UserRepositoryService);
        const userStoreService = injector.get(UserStoreService);

        try {
            const res = await lastValueFrom(userRepositoryService.getIsLogin());
            userStoreService.setUserIsLogin(res.result);
        } catch (error) {
            userStoreService.setUserIsLogin(false);
        }
    };
}
