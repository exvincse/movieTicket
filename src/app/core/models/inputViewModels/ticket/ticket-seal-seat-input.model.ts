// 送出已選座位
export interface TickSealSeatInputModel {
    movieId: number;
    movieName: string;
    ticketDateTime: string;
    ticketLanguageCode: string;
    ticketLanguageName: string;
    ticketCategory: {
        column: number;
        seat: number;
    }[],
    totalCost: number;
}
