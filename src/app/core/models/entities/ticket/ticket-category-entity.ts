// 票卷分類
export interface TicketCategoryEntity {
    categoryCode: string;
    categoryName: string;
    cost: number;
}

export type TicketCategoryCountEntity = TicketCategoryEntity & { count: number };
