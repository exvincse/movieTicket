import { BaseApiOutputModel } from "../base/base-api-output-model";

// 票卷分類
export interface TicketCategoryOutputModel {
    categoryCode: string;
    categoryName: string;
    cost: number;
}

// 票卷分類(含基本回傳格式)
export type TicketCategoryOutputModelEntity = BaseApiOutputModel<TicketCategoryOutputModel[]>;
