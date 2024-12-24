import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { environment } from "../../environments/environment.prod";

const { apiUrl } = environment;

/**
 * ProductsService
 */
@Injectable({
    providedIn: "root",
})
export class ProductsService {
    private http = inject(HttpClient);

    /**
     * 取得產品清單，測試JWT Token
     * @returns any
     */
    GetProductList(): unknown {
        const headers = new HttpHeaders().set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
        return this.http.get(`${apiUrl}/ProductList`, { headers });
    }

    /**
     * 取得新的Access Token
     * @returns any
     */
    RefreshToken(): unknown {
        return this.http.post(`${apiUrl}/Refresh_Token`, localStorage.getItem("refreshToken"));
    }
}
