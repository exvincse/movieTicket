import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";

import { setUserData } from "../user.actions";
import { selectUserData } from "../user.selectors";
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
    getUserData(): Observable<UserDataType | null> {
        return this.store.select(selectUserData);
    }
}
