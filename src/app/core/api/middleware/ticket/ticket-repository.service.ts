import { Injectable } from "@angular/core";
import { TickSeatInputModel } from "@app/core/models/inputViewModels/ticket/ticket-seat-input.model";
import { Observable } from "rxjs";

import { TicketPersonalListLnputModel } from "../../../models/inputViewModels/ticket/ticket-personal-list-input.model";
import { BaseApiOutputModel } from "../../../models/outputViewModels/base/base-api-output-model";
import { TicketCategoryOutputModelEntity } from "../../../models/outputViewModels/ticket/ticket-category-output-model";
import { TicketLanguageOutputModelEntity } from "../../../models/outputViewModels/ticket/ticket-language-output-model";
import { TicketPersonalOutputModelEntity } from "../../../models/outputViewModels/ticket/ticket-presonal-list-output.model";
import { TicketSeatOutputModelEntity } from "../../../models/outputViewModels/ticket/ticket-seat-output.model";
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
    postSelectSeat(param: TickSeatInputModel): Observable<TicketSeatOutputModelEntity> {
        return this.restfulApiService.post<TicketSeatOutputModelEntity>(TicketUrl.postSelectSeat, param);
    }

    /**
     * 送出已選座位
     * @param param param
     * @returns any
     */
    postSealTicket<T>(param: T): Observable<BaseApiOutputModel<boolean & string>> {
        return this.restfulApiService.post(TicketUrl.postSealTicket, param);
    }

    /**
     * 取得個人電影票列表
     * @param param param
     * @returns any
     */
    getPersonalTicketList(param: TicketPersonalListLnputModel): Observable<TicketPersonalOutputModelEntity> {
        return this.restfulApiService.get(TicketUrl.getPersonalTicketList, param);
    }

    /**
     * 取得paypal訂單是否付款成功
     * @param param param
     * @returns any
     */
    postSuccessOrder<T>(param: T): Observable<BaseApiOutputModel<boolean>> {
        return this.restfulApiService.post(TicketUrl.postSuccessOrder, param);
    }

    /**
     * 取得paypal訂單資料
     * @param param param
     * @returns any
     */
    getOrderDetail<T>(param: T): Observable<BaseApiOutputModel<string>> {
        return this.restfulApiService.get(TicketUrl.getOrderDetail, param);
    }
}
