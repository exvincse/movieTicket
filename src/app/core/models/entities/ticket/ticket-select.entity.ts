import { TicketCategoryEntity } from "./ticket-category-entity";

// 選取票卷資訊
export interface TicketSelect {
    date: string;
    ticketLanguageCode: string;
    ticketLanguageName: string;
    time: string;
    ticketCategory: (TicketCategoryEntity & { count: number })[];
}

// 電影座位
export interface TicketSeat {
    column: number
    seat: {
        disableSeat: boolean;
        isSelect: boolean;
        no: number
    }
}

export interface Seat {
    column: number;
    seat: number;
}

export type TicketParam = Pick<TicketSelect["ticketCategory"][number], "categoryCode" | "categoryName" | "cost"> & {
    column: number;
    seat: number;
};
