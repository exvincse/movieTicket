// Api基本回傳格式
export interface BaseApiOutputModel<T> {
    statusCode: number;
    message: string;
    result: T
}
