import { TicketCategoryCountEntity } from "./ticket-category-entity";

// 選取票卷資訊
export interface TicketSelect {
    date: string;
    ticketLanguageCode: string;
    ticketLanguageName: string;
    time: string;
    ticketCategory: TicketCategoryCountEntity[];
}

export interface Seat {
    column: number;
    seat: number | null;
}

export type SpcialSeat = (Seat & {
    insertCount: number
});

export type SeatChart = (Seat & {
    state: {
        disableSeat: boolean,
        isSelect: boolean,
        isFirstSeat: boolean,
        isLastSeat: boolean
    }
});

export type TicketParam = Pick<TicketSelect["ticketCategory"][number], "categoryCode" | "categoryName" | "cost"> & {
    column: number;
    seat: number;
};
