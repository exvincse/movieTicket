import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TicketCategoryOutputModelEntity } from "../../../models/outputViewModels/ticket/ticket-category-output-model";
import { TicketLanguageOutputModelEntity } from "../../../models/outputViewModels/ticket/ticket-language-output-model";
import { TicketUrl } from "../../api-url/ticket-url";
import { RestfulApiService } from "../../restful/restful-api.service";

/**
 * TickRepositoryService
 */
@Injectable({
    providedIn: "root"
})
export class TicketRepositoryService {
    /**
     * constructor
     * @param restfulApiService RestfulApiService
     */
    constructor(public restfulApiService: RestfulApiService) { }

    /**
     * 取得電影票卷分類
     * @returns any
     */
    getTicketCategory(): Observable<TicketCategoryOutputModelEntity> {
        return this.restfulApiService.get(TicketUrl.getTicketCategory);
    }

    /**
     * 取得電影票卷語言
     * @returns any
     */
    getTicketLanguage(): Observable<TicketLanguageOutputModelEntity> {
        return this.restfulApiService.get(TicketUrl.getTicketLanguage);
    }

    /**
     * 取得已選座位
     * @param param param
     * @returns any
     */
    postSelectSeat<T>(param: T): Observable<any> {
        return this.restfulApiService.post(TicketUrl.postSelectSeat, param);
    }

    /**
     * 取得已選座位
     * @param param param
     * @returns any
     */
    postSealTicket<T>(param: T): Observable<any> {
        return this.restfulApiService.post(TicketUrl.postSealTicket, param);
    }
}
