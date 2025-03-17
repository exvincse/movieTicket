// paypal訂單資訊
export interface PaypalOrderOutputModel {
    orderId: string;
    createTime: string;
    status: string;
    link: string;
    amount: string;
}
