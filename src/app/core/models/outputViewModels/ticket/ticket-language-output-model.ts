import { BaseApiOutputModel } from "../base/base-api-output-model";

// 取得電影票卷語言
export interface TicketLanguageOutputModel {
    categoryCode: string;
    categoryName: string;
}

// 取得電影票卷語言(含基本回傳格式)
export type TicketLanguageOutputModelEntity = BaseApiOutputModel<TicketLanguageOutputModel[]>;
