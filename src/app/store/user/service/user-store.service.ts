import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { clearUserData, setUserData, setUserIsLoginData } from "../user.actions";
import { selectUserData, selectUserIsLoginData } from "../user.selectors";
import { UserDataType } from "../user.state";

/**
 * UserStoreService
 */
@Injectable({
    providedIn: "root"
})
export class UserStoreService {
    /**
     * constructor
     * @param store Store
     */
    constructor(public store: Store) { }

    /**
     * 設定使用者資料
     * @param userData 使用者資料
     */
    setUserData(userData: UserDataType): void {
        this.store.dispatch(setUserData({ userData }));
    }

    /**
     * 取得使用者資料
     * @returns 使用者資料
     */
    getUserData(): Observable<UserDataType> {
        return this.store.select(selectUserData);
    }

    /**
     * 設定使用者是否登入
     * @param isLogin 是否登入
     */
    setUserIsLogin(isLogin: boolean): void {
        this.store.dispatch(setUserIsLoginData({ isLogin }));
    }

    /**
     * 取得使用者是否登入
     * @returns 使用者是否登入
     */
    getUserIsLogin(): Observable<boolean> {
        return this.store.select(selectUserIsLoginData);
    }

    /**
     * 清除使用者資料
     */
    setClearUserData(): void {
        this.store.dispatch(clearUserData());
    }
}
