import { Injectable } from "@angular/core";
import Cookies from "js-cookie";

/**
 * CookieService
 */
@Injectable({
    providedIn: "root"
})
export class CookieService {
    /**
     * 設定 Cookie
     * @param name 設定cookie名稱
     * @param value 設定value
     * @param minutes 設定分鐘
     */
    set(name: string, value: string, minutes: number): void {
        Cookies.set(name, value, { expires: minutes / (24 * 60) });
    }

    /**
     * 取得 Cookie
     * @param name name
     * @returns cookie value
     */
    get(name: string): string | undefined {
        return Cookies.get(name);
    }

    /**
     * 移除 Cookie
     * @param name name
     */
    remove(name: string): void {
        Cookies.remove(name);
    }
}
