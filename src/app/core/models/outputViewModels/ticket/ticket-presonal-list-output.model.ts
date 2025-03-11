import { BaseApiOutputModel } from "../base/base-api-output-model";

// 個人票卷單筆項目
export interface TicketPersonalOutputModel {
    totalPage: number;
    pageIndex: number;
    pageSize: number;
    result: TicketPersonalItem[]
}

export interface TicketPersonalItem {
    movieName: string;
    ticketDate: string;
    ticketLanguageName: string;
    ticketPersonalItem: {
        ticketCategoryName: string;
        ticketColumn: number;
        ticketSeat: number;
        ticketMoney: number;
    }[],
    ticketStatusName: string;
}

// 個人票卷(含基本回傳格式)
export type TicketPersonalOutputModelEntity = BaseApiOutputModel<TicketPersonalOutputModel>;
