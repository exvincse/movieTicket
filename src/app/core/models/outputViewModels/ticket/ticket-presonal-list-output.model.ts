import { BaseApiOutputModel } from "../base/base-api-output-model";

// 個人票卷單筆項目
export interface TicketPersonalOutputModel {
    totalPage: number;
    pageIndex: number;
    pageSize: number;
    result: TicketPersonalItem[]
}

export interface TicketPersonalItem {
    ticketDate: string;
    ticketCategoryName: string;
    ticketLanguageName: string;
    column: number;
    seat: number;
}

// 個人票卷(含基本回傳格式)
export type TicketPersonalOutputModelEntity = BaseApiOutputModel<TicketPersonalOutputModel>;
