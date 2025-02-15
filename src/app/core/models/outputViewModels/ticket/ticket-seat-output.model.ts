import { BaseApiOutputModel } from "../base/base-api-output-model";

// 座位
export interface TicketSeatOutputModel {
    column: number;
    seat: number;
}

// 座位(含基本回傳格式)
export type TicketSeatOutputModelEntity = BaseApiOutputModel<TicketSeatOutputModel[]>;
